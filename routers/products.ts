import express from 'express';
import {ProductWithoutId} from "../types";
import {imagesUpload} from "../multer";
import {Error} from "mongoose";
import Product from "../models/Product";

const productRouter = express.Router();


// MongoDB

productRouter.get('/', async (req, res, next) => {
    try {
        const products = await Product.find();
        res.send(products);
    } catch (e) {
        next(e); // 500 сервак падает и такого допускать не нужно
    }
});

// MongoDB

productRouter.get('/:id', async (req, res, next) => {
    const id = req.params.id;

    try {
        const product = await Product.findById(id);

        if (!product) {
            res.status(404).send({message: 'Product not found'});
            return;
        }

        res.send(product);
    } catch (e) {
        next(e);
    }
});

// MongoDB

productRouter.post('/', imagesUpload.single('image'), async (req, res, next) => {
    try {
        const newProduct: ProductWithoutId = {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            image: req.file ? 'images/' + req.file.filename : null,
        };

        const product = new Product(newProduct);
        await product.save();
        res.send(product);
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
            return;
        }

        next(error);
    }
});


export default productRouter;