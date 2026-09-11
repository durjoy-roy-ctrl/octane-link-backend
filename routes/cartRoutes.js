const express = require("express");
const authMiddleware = require('../middleware/authMiddleware');
const Cart = require('../models/cart');
const router = express.Router();
router.get('/',authMiddleware,async (req,res)=>{
try{
    const cart = await Cart.findOne({user:req.user.id}).populate('items.product')
    if(!cart){
        return res.status(200).json({
            items:[]
        })
    }
    res.status(200).json(cart)
}catch(error){
    HTMLFormControlsCollection.error('Get cart error:',error.message)
    res.status(500).json({
        message:'Something went wrong'
    })
   }
})
router.post('/',authMiddleware,async(req,res)=>{
    
    try{
        const {productId,quantity = 1} = req.body
    if(!productId){
        return res.status(400).json({message: 'Product ID is required'})
    }
    let cart = await Cart.findOne({user: req.user.id})
    if(!cart){
        cart = await Cart.create({
            user: req.user.id,
            items:[]
        })
    }
    const existingItem = cart.items.find(
        item => item.product.toString() === productId
    )
    if(existingItem)
        existingItem.quantity += quantity
    else{
        cart.items.push({
            product:productId,
            quantity:quantity
        })
    }
    await cart.save()
    res.status(200).json({
        message:'product added to cart',
        cart
    })
}catch(error){
    console.error('Add to cart error:',error.message)
    res.status(500).json({
        message: 'Something went wrong'
    })
}
})
router.patch('/:productId',authMiddleware,async(req,res)=>{
    try{
        const{productId} = req.params;
        const{quantity} = req.body;
        if(quantity === undefined||quantity<1){
            return res.status(400).json({message:'A valid quantity (.=1) is required'});
        }
        const cart = await Cart.findOne({user:req.user.id});
        if(!cart){
            return res.status(404).json({message:'Cart not found'});
        }
        const item = cart.items.find(
            (item)=>item.product.toString() === productId
        );
        if(!item){
            return res.status(404).json({message:'Item not found in cart'});
        }
        item.quantity = quantity;
        await cart.save();

        res.status(200).json({messaage:'Quantity updated'});
    }catch(error){
        console.error('Update cart error:',error.message);
        res.status(500).json({message:'Something went wrong'});
    }
});
router.delete('/:productId',authMiddleware,async(req,res)=>{
    try{
        const{productId} = req.params;
        const cart = await Cart.findOne({user:req.user.id});
    if(!cart){
        return res.status(404).json({message:'Cart not found'});
    }
    cart.items = cart.items.filter(
        (item)=>item.product.toString() !== productId
    );
    await cart.save();
    res.status(200).json({message:'Item removed',cart});
    }catch(error){
        console.error('Remove item from cart error:',error.messaage);
        res.status(500).json({message:'Something went wrong'});
    }
});
module.exports = router;