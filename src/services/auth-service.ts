import { Request } from "express";
import { User } from "../models/user-model";
import { WebError } from "../utilities/web-errors";
import jwt, { verify, verify as verifyToken } from "jsonwebtoken";
import { v4 as uuidV4 } from 'uuid';
import { createHash, verifyHash } from "../utilities/hash-password";
import { generateToken } from "../middlewares/token";
import { JWT_SECRET_KEY } from "../config";


class AuthService {

    async login(req: Request) {
        const {
            email,
            password
        } = req.body

        const user = await User.findOne({ where: { email } })
        console.log(user);

        if (!user) {
            throw WebError.NotFound('User not found, please review.')
        }

        if (user.dataValues.holded) {
            throw WebError.NotFound('Your account is on Hold, Please contact your admin')
        }

        if (user.dataValues.locked) {
            throw WebError.NotFound('Your account is Locked, Please contact your admin')
        }

        if (user.dataValues.login_attemps === 5) {
            throw WebError.BadRequest("We've locked your account to keep it safe. but we can email you a new password.")
        }

        const passwordIsMatching = await verifyHash(password, user.dataValues.password);

        if (!passwordIsMatching) {
            user.dataValues.login_attemps += 1;
            await user.save();
            if (user.dataValues.login_attemps < 4) {
                throw WebError.BadRequest(`Password not matched, please review.`)
            } else {
                throw WebError.BadRequest(`You entered the wrong password 4 times, You have 1 attempt before your account is locked.`)
            }
        }

        if (user.dataValues.is_first_time) {
            const tokenID = uuidV4()
            const resetToken = generateToken({
                tokenID,
                email: user.dataValues.email
            })
            // user.resetToken = tokenID;
            await user.update({
                resetToken: tokenID,
                login_attemps: 0
            })
            return { resetToken, user }
        } else {
            const tokenID = uuidV4()
            const token = generateToken({
                email: user.dataValues.email,
                id: user.dataValues.id,
                role: user.dataValues.role,
                activeTokenID: tokenID,
                pincode: user.dataValues.pincode
            });
            await user.update({
                login_attemps: 0,
                activeTokenID: tokenID
            })
            return { token, user }
        }

    }

    async resetPassword(data: any) {
        const { resetToken, newPassword, confirmedPassword } = data
        let tokenID: string

        try {
            const verificationResponse = verifyToken(resetToken, JWT_SECRET_KEY!) as any;
            tokenID = verificationResponse.tokenID;
        } catch (e) {
            console.log(e);
            throw WebError.BadRequest(`Invalid Token`)
        }

        console.log(tokenID);
        let user = await User.findOne({ where: { resetToken: tokenID } })
        console.log(user?.dataValues);

        if (!user) {
            throw WebError.NotFound(`User not found, please review.`)
        }

        if (newPassword !== confirmedPassword) {
            throw WebError.BadRequest('Confirmed password is not matching.')
        }

        const hashedPassword = await createHash(newPassword)
        console.log(hashedPassword);
        // user.dataValues.password = hashedPassword
        await user.update({
            password: hashedPassword,
            is_first_time: false,
            resetToken: null
        });
        console.log(user.dataValues);

        return user
    }

    async forgetPassword(email: string) {
        let user = await User.findOne({ where: { email } });
        if (!user) {
            throw WebError.NotFound(`Invalid Email address`)
        }

        const tokenID = uuidV4()
        const resetToken = generateToken({
            tokenID,
            email: user.dataValues.email
        })
        await user.update({
            resetToken: tokenID,
            login_attemps: 0
        })

        let resetLink = `/reset-password?resetToken=${resetToken}`

        return true
    }

    async setPinCode(args: any) {
        const { pinCode, confirmedPinCode, currenctUser } = args

        if (pinCode !== confirmedPinCode) {
            throw WebError.BadRequest(`Confirmed pin code is not matching.`);
        }

        let user = await User.findOne({ where: { email: currenctUser.email } })
        if (!user) {
            throw WebError.NotFound('User not found!') // should never happen
        }

        const isTheOld = user.dataValues.pincode ? await verifyHash(String(pinCode), user.dataValues.pincode) : false;

        if (isTheOld) {
            throw WebError.BadRequest(`new pin code can't be the same as your old pin code.`)
        }

        const hashedPinCode = await createHash(String(pinCode))
        await user.update({
            pincode: hashedPinCode
        })

        return true
    }

    async confirmPinCode(args: any) {
        const { pinCode, currentUser } = args;

        const user = await User.findOne({ where: { email: currentUser.email } })
        console.log('old', user?.dataValues.pincode);

        const isTheOld = await verifyHash(String(pinCode), user?.dataValues.pincode);

        if (!isTheOld) {
            throw WebError.BadRequest(`The pin code is incorrect, please review`)
        }

        return true
    }

    async changePassword(args: any) {
        const {
            oldPassword,
            newPassword,
            confirmedPassword,
            currentUser
        } = args

        console.log(currentUser);


        let user = await User.findOne({ where: { email: currentUser.email } })

        const passwordIsMatching = await verifyHash(oldPassword, user?.dataValues.password);

        if (!passwordIsMatching) {
            throw WebError.BadRequest('Old password is incorrect, please review.')
        }

        if (oldPassword === newPassword) {
            throw WebError.BadRequest('New password can not be the same as old password, please review.')
        }

        if (newPassword !== confirmedPassword) {
            throw WebError.BadRequest('Confirmed password is not matching.')
        }

        let hashedPassword = await createHash(newPassword)
        await user?.update({
            password: hashedPassword
        })

        return true

    }

    async chnagePinCode(args: any) {
        const {
            oldPinCode,
            newPinCode,
            confirmedPinCode,
            currentUser
        } = args

        let user = await User.findOne({ where: { email: currentUser.email } });
        const pinCodeIsMatching = await verifyHash(String(oldPinCode), user?.dataValues.pincode)

        if (!pinCodeIsMatching) {
            throw WebError.BadRequest('Old pin code is incorrect, please review.')
        }

        if (newPinCode !== confirmedPinCode) {
            throw WebError.BadRequest('Confirmed pin code is not matching.')
        }

        let hashedPincode = await createHash(String(newPinCode));
        console.log('before', user?.dataValues);

        await user?.update({
            pincode: hashedPincode
        })

        console.log('after', user?.dataValues);


        return true
    }

    async logout(currentUser: any) {
        let user = await User.findOne({ where: { email: currentUser.email } })
        await user?.update({
            activeTokenID: null,
            is_loggedIn: false
        })
        return true
    }


}

export default AuthService;