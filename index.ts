import mongoose from 'mongoose';
import express from "express";
import productRouter from "./routers/products";
import cors from "cors";
import categoryRouter from "./routers/categories";
import usersRouter from "./routers/users";
import config from "./config";
import adminRouter from "./routers/admin";
import cookieParser from 'cookie-parser';

const app = express();
const port = 8000;

app.use(cors({
    origin: ['http://localhost:5173', 'https://github.com'],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());

app.use('/admin', adminRouter);

app.use('/users', usersRouter);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);

const run = async () => {
    await mongoose.connect(config.db);

    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
};

run().catch(console.error);

