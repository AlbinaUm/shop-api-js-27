import express from 'express';
import {Product, ProductWithoutId} from "../types";
import {imagesUpload} from "../multer";
import mysqlDb from "../mysqlDb";
import {ResultSetHeader} from "mysql2";
import mongoDb from "../mongoDb";
import {ObjectId} from "mongodb";

const productRouter = express.Router();

// productRouter.get('/', async (req, res) => {
//     const products = await fileDb.getAllProducts();
//     const queryId = req.query.id as string;
//     console.log(queryId);
//     res.send(products);
// });

// MySQL
// productRouter.get('/', async (req, res) => {
//     const connection = await mysqlDb.getConnection();
//     const [result] = await connection.query('SELECT * FROM products');
//     const products =  result as Product[];
//     res.send(products);
// });

// MongoDB

productRouter.get('/', async (req, res, next) => {
    try {
        const db = mongoDb.getDb(); // products, category - коллекции
        const products = await db.collection('products').find().toArray();
        res.send(products);
    } catch (e) {
        next(e); // 500 сервак падает и такого допускать не нужно
    }
});


// --------

// productRouter.get('/:id', async (req, res) => {
//     const product = await fileDb.getProductById(req.params.id);
//     res.send(product);
// });

// MySQL

// productRouter.get('/:id', async (req, res) => {
//     const id = req.params.id;
//     const connection = await mysqlDb.getConnection();
//     const [result] = await connection.query('SELECT * FROM products WHERE id = ?', [id]);
//     const product = result as Product[];
//     res.send(product[0]);
// });

// MongoDB

productRouter.get('/:id', async (req, res, next) => {
    const id = req.params.id;

    try {
        const db = mongoDb.getDb(); // products, category - коллекции
        const product = await db.collection('products').findOne({ _id: new ObjectId(id)});

        if (product) {
            res.send(product);
            return;
        } else {
            res.status(404).send({message: 'Product not found'});
        }
    } catch (e) {
        next(e);
    }
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

// MYSQL

// productRouter.post('/', imagesUpload.single('image'), async (req, res) => {
//     if (!req.body.title || !req.body.price || !req.body.category_id) {
//         res.status(400).send({error: "Please send a title, category_id and price"});
//         return;
//     }
//
//     const newProduct: ProductWithoutId = {
//         category_id: req.body.category_id,
//         title: req.body.title,
//         description: req.body.description,
//         price: Number(req.body.price),
//         image: req.file ? 'images/' + req.file.filename : null,
//     };
//
//
//     const connection = await mysqlDb.getConnection();
//     const [result] = await connection.query(
//         'INSERT INTO products (category_id, title, description, price, images) VALUES (?, ?, ?, ?, ?)',
//         [newProduct.category_id, newProduct.title, newProduct.description, newProduct.price, newProduct.image],
//     );
//
//     const resultHeader = result as ResultSetHeader;
//     const id = resultHeader.insertId;
//
//     const [oneProduct] = await connection.query('SELECT * FROM products WHERE id = ?', [id]);
//     const product = oneProduct as Product[];
//     res.send(product[0]);
// });

// MongoDB

productRouter.post('/', imagesUpload.single('image'), async (req, res, next) => {
    try {
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

        const db = mongoDb.getDb(); // products, category - коллекции
        const resultOfSaveNewProduct = await db.collection('products').insertOne(newProduct);

        const product = await db.collection('products').findOne({ _id: new ObjectId(resultOfSaveNewProduct.insertedId)});

        if (product) {
            res.send(product);
            return;
        } else {
            res.status(404).send({message: 'Product not found'});
        }
    } catch (e) {
        next(e);
    }
});


export default productRouter;