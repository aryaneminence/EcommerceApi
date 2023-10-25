const express=require('express')
const router=express.Router()
const { deleteUser,
signupUser,
loginUser,
updateUser,getAllUsers, updateProfile}=require('../Api/user')

const authorizationToken=require('../Middleware/auth')
router.post('/login',loginUser,authorizationToken)
router.post('/signup',signupUser)
router.post('/update',updateUser)
router.delete('/delete',deleteUser,authorizationToken)
router.get('/allusers',getAllUsers)
router.post('/updateprofile',updateProfile)


module.exports=router