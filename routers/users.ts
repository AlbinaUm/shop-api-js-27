import express from "express";
import {Error} from 'mongoose';
import User from "../models/User";
import auth, {RequestWithUser} from "../middleware/auth";
import {OAuth2Client} from "google-auth-library";
import config from "../config";

const usersRouter = express.Router();
const client = new OAuth2Client(config.google.clientId);

usersRouter.post('/google', async (req, res, next) => {
    try {

        if (!req.body.credential) {
            res.status(400).send({error: 'Google login Error!'});
            return;
        }

        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: config.google.clientId,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            res.status(400).send({error: 'Google login Error!'});
            return;
        }

        const email = payload['email'];
        const googleID = payload['sub'];
        const displayName = payload['name'];

        if (!email){
            res.status(400).send({error: 'No enough user data to continue!'});
            return;
        }

        let user = await User.findOne({googleID: googleID});


        const genPassword = crypto.randomUUID();

        if (!user) {
            user = new User({
                username: email,
                password: genPassword,
                confirmPassword: genPassword,
                displayName,
                googleID,
            });
        }

        user.generateToken();
        await user.save();


        res.cookie('token', user.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', // CSRF
        });

        const safeUser = {
            _id: user._id,
            username: user.username,
            role: user.role,
            displayName: user.displayName,
        };

        res.send({user: safeUser, message: 'Login with Google successfully.'});
    } catch (e){
        next(e);
    }
});


usersRouter.post('/', async (req, res, next) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        });

        user.generateToken();
        await user.save();

        res.cookie('token', user.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', // CSRF
        });

        const safeUser = {
            _id: user._id,
            username: user.username,
            role: user.role,
        };

        res.send({user: safeUser, message: 'User registered successfully.'});
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
            return;
        }

        next(error);
    }
});

usersRouter.post('/sessions', async (req, res, _next) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).send({error: 'Username and password must be in req'});
        return;
    }

    const user = await User.findOne({username: req.body.username});

    if (!user) {
        res.status(404).send({error: "Username not found"});
        return;
    }

    const isMath = await user.checkPassword(req.body.password);

    if (!isMath) {
        res.status(400).send({error: 'Password is incorrect'});
        return;
    }

    user.generateToken();
    await user.save();

    res.cookie('token', user.token, {
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       sameSite: 'strict', // CSRF
    });

    const safeUser = {
        _id: user._id,
        username: user.username,
        role: user.role,
    };

    res.send({message: 'Username and password is correct', user: safeUser});
});

// logout
usersRouter.delete('/sessions', auth, async (req, res, next) => {
    const token = req.get('Authorization');

    if (!token) {
        res.send({message: 'Success logout'});
        return;
    }

    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    try {
        const user = await User.findOne({token});

        if (user) {
            user.generateToken();
            await user.save();
        }

        res.send({message: 'Success logout'});
    } catch (e) {
        next(e);
    }
});

usersRouter.post('/secret', auth, async (req, res, _next) => {
    const user = (req as RequestWithUser).user;

    res.send({
        message: 'Secret message',
        user: user,
    });
});


export default usersRouter;