import { Request } from 'express';
import { User } from '../models/user-model';
import { WebError } from '../utilities/web-errors';
import { generateRandomPassword } from '../utilities/generate-passwords';
import { sendMail } from '../utilities/emails';
import { createHash } from '../utilities/hash-password';
import { EmailRequest } from '../utilities/common-interfaces';
import RabbitMQ from '../rabbitMQ/rabbitmq';
import { uploadFile } from '../utilities/upload-files';
import { where } from 'sequelize';
class UserService {

    async createAdminUser(req: Request){
        const {
            first_name,
            middle_name,
            last_name,
            email,
            password,
            pincode,
            mobile,
            dob,
            working_hours,
            working_days,
            role,
        } = req.body

        const userWithSameEmail = await User.findOne({ where: { email: email } });
        const userWithSameMobile = await User.findOne({ where: { mobile: mobile } });
        if (userWithSameEmail) {
            throw WebError.BadRequest(`The email is already associated with an existing user`)
        }
        if (userWithSameMobile) {
            throw WebError.BadRequest(`The mobile is already associated with an existing user`)
        }

        let hashedPassword = await createHash(password)
        const hashedPinCode = await createHash(String(pincode))


        const newUser = await User.create(
            {
                first_name,
                middle_name,
                last_name,
                email,
                password: hashedPassword,
                pincode: hashedPinCode,
                mobile,
                dob,
                working_hours,
                working_days: working_days.join('-'),
                role,
                is_first_time: false
            }
        )

        return newUser.dataValues

    }

    async createNewUser(body: any, image: any) {
        
        const {
            first_name,
            middle_name,
            last_name,
            email,
            mobile,
            dob,
            working_hours,
            working_days,
            role,
            user
        } = body

        // console.log(body)

        if(user.role !== 'superadmin'){
            throw WebError.Forbidden(`You are not authorized to do this action.`)
        }

        const userWithSameEmail = await User.findOne({ where: { email: email } });
        const userWithSameMobile = await User.findOne({ where: { mobile: mobile } });

        if (userWithSameEmail) {
            throw WebError.BadRequest(`The email is already associated with an existing user`)
        }

        if (userWithSameMobile) {
            throw WebError.BadRequest(`The mobile is already associated with an existing user`)
        }

        const password = generateRandomPassword()
        let hashedPassword = await createHash(password)

        const img_url = await uploadFile(image, 'user-profile');
        const newUser = await User.create(
            {
                first_name,
                middle_name,
                last_name,
                email,
                password: hashedPassword,
                mobile,
                dob,
                working_hours,
                working_days, // Store as array directly instead of joining
                role,
                img_url: img_url.url,
            }
        )

        const mailBody = `
            Your initial password is '${password}' .
            don't forget to set a new password after your first time login 
        `

        const mailObj: EmailRequest = {
            to: email,
            subject: 'User Password',
            content: mailBody
        }

        const rabbitMQ = await RabbitMQ.getInstance();
        rabbitMQ.sendMail(mailObj);

        // sendMail(email, 'User Password', mailBody)

        // console.log(user);
    }

    async getUsersList(req: Request) {
        const page = req.query.page ? +req.query.page : -1;
        const limit = req.query.limit ? +req.query.limit : 10;
        const searchKey = req.query.searchKey;
        const offset = (page - 1) * limit;
        const currentUser = req.body.user
        const exclude = ["password", "activeTokenID", "is_loggedIn", "pincode", "resetToken"];
        let opt: any = {
            attributes: { exclude },
            offset: offset,
            limit: limit,
            order: [['createdAt', 'DESC']],
            where: {
                deleted: false,
            }
        };

        if (searchKey) {
            opt = {
                ...opt,
                where: {
                    deleted: false,
                    email: searchKey
                }
            }
        }


        const { count, rows } = await User.findAndCountAll(opt)
        const response = {
            count,
            activePage: page,
            rows
        }
        return response
    }

    // async getUserDetails(req: Request) {
    //     const userId = req.query.id;
    //     const user = await User.findOne({
    //         where: {
    //             id: userId,
    //         },
    //         attributes: { exclude: ["password", "activeTokenID", "is_loggedIn", "pincode", "resetToken"] },
    //     });
    //     if (!user) {
    //         throw WebError.BadRequest('userId is invalid, please review')
    //     }
    //     // console.log(user);

    //     return user;
    // }

    async deleteUser(id: string, user: any){
        if(user.role !== 'superadmin'){
            throw WebError.Forbidden(`You are not authorized to do this action.`)
        }

        const userToDelete = await User.findOne({ where: { id } });
        if (!userToDelete) {
            throw WebError.BadRequest('userId is invalid, please review')
        }

        await userToDelete.update({
            deleted: true,
        });
        return true;
    }

    async getUserDetails(id: string) {
        const user = await User.findOne({
            where: {
                id,
                deleted: false,
            },
            attributes: { exclude: ["password", "activeTokenID", "is_loggedIn", "pincode", "resetToken"] },
        });
        if (!user) {
            throw WebError.BadRequest('userId is invalid, please review')
        }
        return user.dataValues;
    }

    async holdUser (id: string, user: any){
        if(user.role !== 'superadmin'){
            throw WebError.Forbidden(`You are not authorized to do this action.`)
        }
        
        const userToHold = await User.findOne({ where: { id } });
        if (!userToHold) {
            throw WebError.BadRequest('user id is invalid, please review')
        }

        if(userToHold.dataValues.deleted){
            throw WebError.BadRequest('This user is already deleted')
        }

        if(userToHold.dataValues.holded){
            throw WebError.BadRequest('This user is already holded')
        }

        await userToHold.update({
            holded: true,
        });
        return true;
    }

    async retrieveUser (id: string, user: any){
        if(user.role !== 'superadmin'){
            throw WebError.Forbidden(`You are not authorized to do this action.`)
        }

        const userToRetrieve = await User.findOne({ where: { id } });
        if (!userToRetrieve) {
            throw WebError.BadRequest('user id is invalid, please review')
        }

        if(userToRetrieve.dataValues.deleted){
            throw WebError.BadRequest('This user is already deleted')
        }

        if(!userToRetrieve.dataValues.holded){
            throw WebError.BadRequest('This user is not holded')
        }

        await userToRetrieve.update({
            holded: false,
        });
        return true;
    }

}

export default UserService;