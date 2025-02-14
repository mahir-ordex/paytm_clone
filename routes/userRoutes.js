const express = require('express');
const {Sign_Up,signIn, getUserData, updateUserProfile, signOut} = require('../controller/user.controller')
const router = express.Router();


router.post("/login",Sign_Up)
router.post("/signin",signIn)
router.get("/signout",signOut)
router.get("/get_userdata/:id",getUserData)
router.patch("/update_user",updateUserProfile)


module.exports = router;