const express =require('express')
require("dotenv").config();
const Connection =require('../Backend/Database.js')
const cors=require('cors')
const user=require('./Routes/user')
const products=require('../Backend/Routes/products')
const cart=require('../Backend/Routes/cart')
const errorMiddleware=require('../Backend/Middleware/errorhandling')
const cloudinary=require('../Backend/Middleware/multer')
const app= express()
const port =5001



app.use(express.json())
app.use(cors())


app.use(cloudinary)

app.use('/',user)
app.use('/',products)
app.use('/',cart)


app.use(errorMiddleware);
Connection(app)
app.listen(port,()=>console.log(`http://localhost:${port}`))
