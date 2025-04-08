import express from 'express';
import {Product, ProductWithoutId} from "../types";
import {imagesUpload} from "../multer";
import mysqlDb from "../mysqlDb";
import {ResultSetHeader} from "mysql2";

const productRouter = express.Router();

// productRouter.get('/', async (req, res) => {
//     const products = await fileDb.getAllProducts();
//     const queryId = req.query.id as string;
//     console.log(queryId);
//     res.send(products);
// });

productRouter.get('/', async (req, res) => {
    const connection = await mysqlDb.getConnection();
    const [result] = await connection.query('SELECT * FROM products');
    const products =  result as Product[];
    res.send(products);
});

// --------

// productRouter.get('/:id', async (req, res) => {
//     const product = await fileDb.getProductById(req.params.id);
//     res.send(product);
// });


productRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    const connection = await mysqlDb.getConnection();
    const [result] = await connection.query('SELECT * FROM products WHERE id = ?', [id]);
    const product =  result as Product[];
    res.send(product[0]);
});

// -----------


// productRouter.post('/', imagesUpload.single('image'), async (req, res) => {
//     const newProduct: ProductWithoutId = {
//         title: req.body.title,
//         description: req.body.description,
//         price: Number(req.body.price),
//         image: req.file ? 'images/' + req.file.filename : null,
//     };
//
//     const savedNewProduct = await fileDb.addNewProduct(newProduct);
//     res.send(savedNewProduct);
// });

productRouter.post('/', imagesUpload.single('image'), async (req, res) => {
    if (!req.body.title || !req.body.price || !req.body.category_id) {
        res.status(400).send({error: "Please send a title, category_id and price"});
        return;
    }

    const newProduct: ProductWithoutId = {
        category_id: req.body.category_id,
        title: req.body.title,
        description: req.body.description,
        price: Number(req.body.price),
        image: req.file ? 'images/' + req.file.filename : null,
    };


    const connection = await mysqlDb.getConnection();
    const [result] = await connection.query(
        'INSERT INTO products (category_id, title, description, price, images) VALUES (?, ?, ?, ?, ?)',
            [newProduct.category_id, newProduct.title, newProduct.description, newProduct.price, newProduct.image],
        );

    const resultHeader = result as ResultSetHeader;
    const id = resultHeader.insertId;

    const [oneProduct] = await connection.query('SELECT * FROM products WHERE id = ?', [id]);
    const product =  oneProduct as Product[];
    res.send(product[0]);
});


export default productRouter;