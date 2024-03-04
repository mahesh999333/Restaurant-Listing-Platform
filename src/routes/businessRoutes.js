const express = require('express');
const router = express.Router();
const {createListing, getAllListings, updateListing, deleteListing} = require('../controllers/busunessController');
const authMiddleware = require("../middleware/authMiddleware")

router.post("/add", authMiddleware, createListing),
router.get('/get', authMiddleware, getAllListings),
router.put('/updateDetails', authMiddleware, updateListing),
router.delete('/delete/:listingId', authMiddleware, deleteListing)


module.exports = router;