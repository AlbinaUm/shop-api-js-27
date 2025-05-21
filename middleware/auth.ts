import {NextFunction, Request, Response} from "express";
import {HydratedDocument} from "mongoose";
import {UserFields} from "../types";
import User, {JWT_SECRET} from "../models/User";
import jwt, {TokenExpiredError} from "jsonwebtoken";

export interface RequestWithUser extends Request {
    user: HydratedDocument<UserFields>;
}

const auth = async (
    expressReq: Request, res: Response, next: NextFunction
) => {
    try {
        const req = expressReq as RequestWithUser;

        const authHeader = req.headers.authorization;


        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).send({error: 'No access token provided.'});
            return;
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, JWT_SECRET) as {_id: string}

        const user = await User.findById(decoded._id);

        if (!user) {
            res.status(401).send({error: 'User not found or invalid access token'});
            return;
        }

        req.user = user;
        next();
    } catch (e) {
        if (e instanceof TokenExpiredError) {
            res.status(401).send({error: 'Your access token expired'});
        } else {
            res.status(401).send({error: 'Please log in to authenticate'});
        }
    }
};

export default auth;