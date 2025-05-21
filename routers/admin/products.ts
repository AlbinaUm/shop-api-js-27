import express from 'express';
import {Error} from "mongoose";
import {imagesUpload} from "../../middleware/multer";
import Product from "../../models/Product";
import {ProductWithoutId} from "../../types";

const productAdminRouter = express.Router();

productAdminRouter.patch('/:id', imagesUpload.single('image'), async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).send({error: 'Product id must be in req params'});
            return;
        }

        const updateProduct = {...req.body};

        if (req.file) {
            updateProduct.image = 'images/' + req.file.filename;
        }

        // product - вернет вам уже обновленный продукт полностью
        const product = await Product.findByIdAndUpdate(id, updateProduct, {new: true, runValidators: true});

        if (!product) {
            res.status(404).send({error: 'Product not found'});
            return;
        }

        await product.save();
        res.send(product);
    } catch (error) {
        if (error instanceof Error.ValidationError  || error instanceof Error.CastError) {
            res.status(400).send(error);
            return;
        }

        next(error);
    }
})


productAdminRouter.get('/', async (req, res, next) => {
    try {
        const category_id = req.query.category as string;
        const filter: {category?: string} = {};

        if (category_id) filter.category = category_id;

        const products = await Product.find(filter).populate("category", "title");
        res.send(products);
    } catch (e) {
        next(e); // 500 сервак падает и такого допускать не нужно
    }
});

productAdminRouter.post('/', imagesUpload.single('image'), async (req, res, next) => {
    try {

        const newProduct: ProductWithoutId = {
            category: req.body.category,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            image: req.file ? 'images/' + req.file.filename : null,
        };

        const product = new Product(newProduct);
        await product.save();
        res.send(product);
    } catch (error) {
        if (error instanceof Error.ValidationError  || error instanceof Error.CastError) {
            res.status(400).send(error);
            return;
        }

        next(error);
    }
});


export default productAdminRouter;