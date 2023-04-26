const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyJWT = require('../middlewares/verifyJWT');

router.get('/', verifyJWT, userController.get);
router.post("/", verifyJWT, userController.create);

module.exports = router;