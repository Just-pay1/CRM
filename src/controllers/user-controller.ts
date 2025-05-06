import { Request, Response, NextFunction } from 'express'; 
import UserService from '../services/user-service';
import { responseHandler } from '../utilities/api-response';

class UserController {
    private service: UserService;

    constructor() {
        this.service = new UserService()
    }

    public handleCreateNewUserReq = async (req: Request, res: Response, next: NextFunction) => {
        await this.service.createNewUser(req);
        responseHandler(res, 201, 'User created successfully!')
    }

    public createAdmin = async (req: Request, res: Response, next: NextFunction) => {
        await this.service.createAdminUser(req);
        responseHandler(res, 201, 'Admin created successfully!')
    }

    public handleGetListOfUsersReq = async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.service.getUsersList(req)
        responseHandler(res, 200, 'List of users fetched successfully!', response)
    }

    public handleGetUserDetailsReq = async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.service.getUserDetails(req)
        responseHandler(res, 200, 'User details fetched successfully!', response)
    }
}

export default UserController;