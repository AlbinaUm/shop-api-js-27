import mongoose from "mongoose";
import config from "./config";
import Category from "./models/Category";
import Product from "./models/Product";
import User from "./models/User";


const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('categories');
        await db.dropCollection('products');
        await db.dropCollection('users');
    } catch (error) {
        console.log('Collections were not present, skipping drop');
    }


    const [cpuCategory, ssdCategory] = await Category.create(
        {
            title: 'CPUs',
            description: 'Central Processor units',
        },
        {
            title: 'SSDs',
            description: 'Solid state Drives',
        }
    );

    await Product.create(
        {
            title: "Intel Core i7",
            price: 350,
            category: cpuCategory._id,
            image: 'fixtures/cpu.jpeg'
        },
        {
            title: "Samsung 990 Pro 1TB",
            price: 170,
            category: ssdCategory._id,
            image: 'fixtures/ssd.jpeg'
        }
    );

    const john = new User({
        username: "John",
        password: "123",
        confirmPassword: "123",
        role: "user",
    });

    john.generateToken();
    await john.save();

    const jane = new User({
        username: "Jane",
        password: "123",
        confirmPassword: "123",
        role: "admin",
    });

    jane.generateToken();
    await jane.save();

    await db.close();
};

run().catch(console.error);