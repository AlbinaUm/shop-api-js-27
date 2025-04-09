import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Заголовок обязательное поле'],
    },
    price: {
        type: Number,
        required: [true, 'Стоимость обязательное поле'],
    },
    description: String,
    image: String,
});


const Product = mongoose.model('Product', ProductSchema);
export default Product;