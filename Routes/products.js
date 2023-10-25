const express=require('express')
const router=express.Router();

const {products,addProduct,deleteProduct}=require('../Api/product')

router.post('/products',addProduct)
router.get('/getproduct',products)
router.delete('/deleteproduct', deleteProduct)


module.exports=router

