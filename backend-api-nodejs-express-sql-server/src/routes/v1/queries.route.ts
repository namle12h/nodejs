import express from "express";
import Product from "../../models/product.model"; // Assuming you have a Product model defined
import { Console } from "console";
const router = express.Router();

router.get("/queries", async (req, res) => {


    // 1. find( ) - Find all documents in a collection


    const products = await Product.find(); // Example of using find() to get all products
    // res.status(200).json(products);

    // 2. find by id( ) - Find a single document by its ID
    // select * from products where id = "689da431fbc03a6c1bb6b170"

    const findById = await Product.findById("689da431fbc03a6c1bb6b170"); // Example of using findOne() to get a single product
    // res.status(200).json(findById);


    // 3. findOne( ) - Find a single document in a collection
    // select top 1 * from products where product_name = "Tasty Aluminum Sausages"
    const findOne = await Product.findOne({ product_name: "Tasty Aluminum Sausages" }); // Example of using findOne() to get a single product by name
    // res.status(200).json(findOne);   

    // 4. find( ) with projection - Find documents with specific fields (projection)
    // select product_name, price, discount from products
    // This will return only the specified fields for each document
    const findFields = await Product.find().select('product_name price discount '); // Example of using find() with projection to get specific fields
    // res.status(200).json(findFields);


    //5 find( ) with projection - Find documents excluding specific fields
    // select * from products except product_name, price, discount
    // This will return all fields except the specified ones
    // Note: Mongoose does not support excluding fields directly in the find() method, but you can achieve this using the select() method with a minus sign (-)
    const findnotfields = await Product.find().select('-product_name -price -discount'); // Example of using find() with projection to exclude specific fields
    // res.status(200).json(findnotfields);

    // 6 find( ) with sorting - Find documents with sorting ascending or descending order
    // select * from products order by price asc
    // This will return all documents sorted by price in ascending order
    const findWithSort = await Product
        .find()
        .select('-product_name  -discount')
        .sort({
            price: 1,
            slug: 1
        }); // Example of using find() with sorting to get products sorted by price in ascending order
    // res.status(200).json(findWithSort);


    // 7 tìm kiếm có điều kiện - Find documents with conditions
    // select * from products where price > 1000 and discount < 10
    // This will return all documents where price is greater than 1000 and discount is less than 10
    const findWithCondition = await Product.find({
        price: { $gt: 1000 }, // lớn hơn 1000
        discount: { $lt: 10 } // nhỏ hơn 10
    }); // Example of using find() with conditions to get products matching specific criteria
    // res.status(200).json(findWithCondition);


    // 8 tìm kiếm có điều kiện hoặc - Find documents with OR conditions
    // select * from products where price > 1000 or discount = 10
    // This will return all documents where price is greater than 1000 or discount is less than 10
    const findWithOrCondition = await Product.find({
        $or: [
            { price: { $gt: 1000 } }, // lớn hơn 1000
            { discount: { $eq: 10 } } // nhỏ hơn 10
        ]
    }); // Example of using find() with OR conditions to get products matching either criteria
    // res.status(200).json(findWithOrCondition);


    // 9. updateOne( ) - Update a single document in a collection
    // update products set price = 2000 where id = "689da431fbc03a6c1bb6b170"
    const updateOne = await Product.findOneAndUpdate(
        { _id: "689da431fbc03a6c1bb6b170" }, // Condition to find the document
        { $set: { price: 3000 } } // Update operation
    ); // Example of using updateOne() to update a single product's price
    console.log(updateOne);
    // res.status(200).json(updateOne);

    // 10 . update có diều kiện - Update documents with conditions
    // update products set price = 2000 where price > 1000
    // This will update all documents where price is greater than 1000
    // const updateWithCondition = await Product.updateMany(
    //     { price: { $gt: 1000 } }, // Condition to find the documents
    //     { $set: { price: 2000 } } // Update operation
    // ); // Example of using updateMany() to update multiple products' prices

    // console.log(updateWithCondition);
    const updateProducts = await Product.find({ price: 2000 }); // Fetch updated products
    // res.status(200).json(updateProducts);

    // 11 join - Join collections (populate)
    const findWithJoin = await Product.find()
        .populate('category', "-__v -updatedAt") // Assuming 'category' , brand is a reference field in the Product model
        .populate('brand_id')
        .select('product_name price category brand_id '); // Example of using populate() to join with the category collection
    res.status(200).json(findWithJoin);





   
});



export default router;