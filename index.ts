import express from "express";
import productRouter from "./routers/products";
import cors from "cors";
import mysqlDb from "./mysqlDb";
import categoryRouter from "./routers/categories";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use('/products', productRouter);
app.use('/categories', categoryRouter);

const run = async () => {
    await mysqlDb.init();

    // await fileDb.init();

    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });
};

run().catch(console.error);

