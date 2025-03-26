import express from 'express';
import fileDb from "../fileDb";
import {ProductWithoutId} from "../types";
import {imagesUpload} from "../multer";

const productRouter = express.Router();

// products?id=5
productRouter.get('/', async (req, res) => {
    const products = await fileDb.getAllProducts();
    const queryId = req.query.id as string;
    console.log(queryId);
    res.send(products);
});

productRouter.get('/:id', async (req, res) => {
    const product = await fileDb.getProductById(req.params.id);
    res.send(product);
});

productRouter.post('/', imagesUpload.single('image'), async (req, res) => {
    const newProduct: ProductWithoutId = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        image: req.file ? 'images/' + req.file.filename : null,
    };

    const savedNewProduct = await fileDb.addNewProduct(newProduct);
    res.send(savedNewProduct);
});

export default productRouter;