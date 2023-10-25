const Cart = require('../Model/cart');
const Product = require('../Model/ProductSchema');
const User = require('../Model/UserSchema');
const {getCartAggregation}=require('../aggregations/cart')

const addtoCart= async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const userId = req.user._id;
        let userCart = await Cart.findOne({ user: userId });
         if (!userCart) {
            userCart = new Cart({ user: userId, items: [], totalPrice: 0 });
        }
          const cartItem = {
            product: product._id,
            quantity,
        };

        userCart.items.push(cartItem);
        userCart.totalPrice += product.price * quantity;
        await userCart.save();
        res.status(201).json({ message: 'Product added to cart successfully', userCart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const editCart= async (req, res) => {
    try {
        const { quantity } = req.body;
        const { cartItemId } = req.params;
        let userCart = await Cart.findOne({ user: req.user._id });
        if (!userCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartItemIndex = userCart.items.findIndex(item => item._id.toString() === cartItemId);

        if (cartItemIndex === -1) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        const originalQuantity = userCart.items[cartItemIndex].quantity;
        const product = await Product.findById(userCart.items[cartItemIndex].product);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        userCart.items[cartItemIndex].quantity = quantity;
        userCart.totalPrice += (quantity - originalQuantity) * product.price;
        await userCart.save();
        res.json({ message: 'Cart item updated successfully', userCart });
    } catch (error) {
        console.error('Error editing cart item:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const getCart = async (req, res) => {
    try {
        const aggregation = getCartAggregation(req.user._id);
        const userCart = await Cart.aggregate(aggregation);

        if (!userCart || userCart.length === 0) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.json({ userCart: userCart[0] }); 
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const deleteCart= async (req, res) => {
    try {
        const { cartItemId } = req.params;
        let userCart = await Cart.findOne({ user: req.user._id });
        if (!userCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const cartItemIndex = userCart.items.findIndex(item => item._id.toString() === cartItemId);
         if (cartItemIndex === -1) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        const deletedItem = userCart.items.splice(cartItemIndex, 1)[0];
        const product = await Product.findById(deletedItem.product);
        if (product) {
            userCart.totalPrice -= deletedItem.quantity * product.price;
        }
        await userCart.save();

        res.json({ message: 'Cart item deleted successfully', userCart });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports ={
   getCart,
    deleteCart,
    addtoCart,
    editCart
};
