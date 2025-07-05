import { Request, Response, NextFunction } from 'express'; 
import UserService from '../services/user-service';
import { responseHandler } from '../utilities/api-response';

interface MulterRequest extends Request {
    file?: any;
}

class UserController {
    private service: UserService;

    constructor() {
        this.service = new UserService()
    }

    public handleCreateNewUserReq = async (req: MulterRequest, res: Response, next: NextFunction) => {
        await this.service.createNewUser(req.body, req.file);
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
        const id = req.query.id
        const response = await this.service.getUserDetails( id as string)
        responseHandler(res, 200, 'User details fetched successfully!', response)
    }

    public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.service.deleteUser(req.body.id, req.body.user);
        responseHandler(res, 200, 'User deleted successfully!', response);
    }
}

export default UserController;