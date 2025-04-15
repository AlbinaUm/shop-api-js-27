import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
   title: {
       type: String,
       required: true,
       unique: true,
       validate: {
           validator: async (value: string) => {
               const category = await Category.findOne({ title: value });
               if (category) return false;
               return true;
           },
           message: "Category title is unique",
       }
   },
    description: String,
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;