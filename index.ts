import mongoose from 'mongoose';
import express from "express";
import productRouter from "./routers/products";
import cors from "cors";
import mysqlDb from "./mysqlDb";
import categoryRouter from "./routers/categories";
import mongoDb from "./mongoDb";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use('/products', productRouter);
app.use('/categories', categoryRouter);

const run = async () => {
    await mysqlDb.init();
    await mongoose.connect('mongodb://localhost/shop-js-27');

    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
};

run().catch(console.error);

