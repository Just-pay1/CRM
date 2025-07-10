import { Router } from "express";
import asyncHandler from "../middlewares/asyncWrapper";
import UserController from "../controllers/user-controller";
import { validateSchemas, validateFormData } from "../middlewares/validateRequests";
import { adminUser, deleteUser, setPassword, setPinCode, userCreateFormData } from "../schemas/user-schemas";
import { detailsSchema, listSchema } from "../schemas/shared-schemas";
import { verifyToken } from "../middlewares/token";
import multer from "multer";


class UserRoutes {
    public router = Router();
    private controller = new UserController()
    private upload = multer()

    constructor() {
        this.initializeUserRoutes();
    }

    private initializeUserRoutes() {
        this.router.post('/create', 
            this.upload.single('image'),
            validateFormData(userCreateFormData),
            verifyToken,
            asyncHandler(this.controller.handleCreateNewUserReq)
        )

        this.router.post('/create-admin', 
            validateSchemas(adminUser),
            asyncHandler(this.controller.createAdmin)
        )

        this.router.get('/list', 
            validateSchemas(listSchema, 'query'),
            verifyToken,
            asyncHandler(this.controller.handleGetListOfUsersReq)
        )

        this.router.get('/details', 
            validateSchemas(detailsSchema, 'query'),
            verifyToken,
            asyncHandler(this.controller.handleGetUserDetailsReq)
        )

        this.router.post('/delete-user', 
            validateSchemas(deleteUser),
            verifyToken,
            asyncHandler(this.controller.deleteUser)
        )

        this.router.post('/hold-user', 
            validateSchemas(detailsSchema),
            verifyToken,
            asyncHandler(this.controller.holdUser)
        )

        this.router.post('/retrieve-user', 
            validateSchemas(detailsSchema),
            verifyToken,
            asyncHandler(this.controller.retrieveUser)
        )

        this.router.post('/unlock-user', 
            validateSchemas(detailsSchema),
            verifyToken,
            asyncHandler(this.controller.unlockUser)
        )
    }
}

export default UserRoutes;