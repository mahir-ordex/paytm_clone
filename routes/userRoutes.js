const express = require('express');
const {Sign_Up,signIn} = require('../controller/user.controller')
const router = express.Router();


router.post("/login",Sign_Up)
router.post("/signin",signIn)


module.exports = router;