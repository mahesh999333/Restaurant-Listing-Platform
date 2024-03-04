const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")
const {creatReview, responseReview} = require('../controllers/reviewController')


router.post('/:businessId', authMiddleware, creatReview)
router.post('/response/:reviewId', authMiddleware, responseReview)


module.exports = router