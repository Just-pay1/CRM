import { Router } from "express";
import UserRoutes from "./user-routes";
import AuthRoutes from "./auth-routes";
import { MerchantRoutes } from "./merchant-routes";


class MainRoute {
    public router = Router();
    private user = new UserRoutes();
    private auth = new AuthRoutes();
    private merchant = new MerchantRoutes();


    constructor() {
        this.initializeAppRoutes();
    }

    private initializeAppRoutes() {
        this.router.use("/user", this.user.router);
        this.router.use("/auth", this.auth.router);
        this.router.use("/merchant", this.merchant.router)
    }

}

export default MainRoute;