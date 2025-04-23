import mongoose from "mongoose";
import Category from "./Category";

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
        validate:  {
            validator: async (value: string) => {
                const category = await Category.findById(value);
                return  !!category;
            },
            message: "Category not found",
        },
    },
    title: {
        type: String,
        required: [true, 'Заголовок обязательное поле'],
    },
    price: {
        type: Number,
        required: [true, 'Стоимость обязательное поле'],
        validate: [
            {
                validator: async (value: string) => {
                   return !isNaN(+value);
                },
                message: "Price must be number",
            },
        ]
    },
    description: {
        type: String,
        default: null,
    },
    image: {
        type: String,
        default: null,
    },
});


const Product = mongoose.model('Product', ProductSchema);
export default Product;