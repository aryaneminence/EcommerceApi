const Products=require('../Model/ProductSchema')
const cloudinary = require('cloudinary').v2;


const deleteProduct=async(req,res)=>{
    try {
    const productId=req.params.id;
    const deleteProduct=await Products.findByIdAndDelete(productId) 
    if(!deleteProduct){
        res.status.json({message:"product not found"})
    }

    res.status(201).json({message:"Product deleted successsfully"})   
    } catch (error) {
      console.log(error)  
      res.status(500).json({message:error})
    }
}




const addProduct = async (req, res) => {
    try {
        const { name, price, image, description, ratings, productId } = req.body;

        const cloudinaryResult = await cloudinary.uploader.upload(image, {
            folder: 'Uploads', 
        })
        const newProduct = new Products({
            name,
            price,
            image: cloudinaryResult.secure_url,
            description,
            ratings,
            productId,
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({ message: 'Product added successfully', savedProduct });
    } catch (error) {
        console.log('Error in adding product', error);
        res.status(500).json({ message: error });
    }
};

const products=async(req,res)=>{
    try {
     const products =await Products.find() 
     res.status(201).json({products})  
    } catch (error) {
     console.log(error)  
     res.status(500).json({message:error}) 
    }
}
module.exports={
    products,
    addProduct,
    deleteProduct,
    

}
