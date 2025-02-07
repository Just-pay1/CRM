import { Router } from "express";
import UserRoutes from "./user-routes";
import AuthRoutes from "./auth-routes";
import { CustomerProfileRoutes } from "./customer-profile-routes";


class MainRoute {
    public router = Router();
    private user = new UserRoutes();
    private auth = new AuthRoutes();
    private customerProfile = new CustomerProfileRoutes();


    constructor() {
        this.initializeAppRoutes();
    }

    private initializeAppRoutes() {
        this.router.use("/user", this.user.router);
        this.router.use("/auth", this.auth.router);
        this.router.use("/customer-profile", this.customerProfile.router)
    }

}

export default MainRoute;