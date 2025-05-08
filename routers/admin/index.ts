import express from "express";
import auth from "../../middleware/auth";
import permit from "../../middleware/permit";
import productAdminRouter from "./products";


const adminRouter = express.Router();

// localhost/admin/products

adminRouter.use(auth, permit('admin'))
adminRouter.use('/products', productAdminRouter);

export default adminRouter;