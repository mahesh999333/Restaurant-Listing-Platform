const Review = require('../models/review')
const Business = require('../models/business')
const {REVIEWROLE, REVIEWRESPONSEROLE} = require("../config/config")
const {validatingReview, isValidId} = require("../utils/validation")


const creatReview = async (req, res) => {
    try {
        let user = req.user._id
        let business = req.params.businessId

        // User role validation
        if (!REVIEWROLE.includes(req.user.role)){
            return res.status(403).json({message: "Only user and admin allowed to review"})
        }

        // validating businessId or listingId
        if (!isValidId(business)){
            return res.status(400).json({message:"invalid business id"}) 
        }

        // check if business exist or not
        let isBusinessExist = await Business.findById(business)
        if (!isBusinessExist){
            return res.status(404).json({message:"Business not found."})
        }

        // Review data validation
        const error = validatingReview(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message })

        let {rating, comment} = req.body

        let newReview = Review({ user,business,rating,comment })
        const savedReview = await newReview.save()

        return res.status(201).json({message:"Reviewed successfully", savedReview})
    } catch (error) {
        return res.status(500).json({message:`Internal server error ${error.message}`})
    }
}


const responseReview = async (req, res) => {
    try {
        // User role validation
        if(!REVIEWRESPONSEROLE.includes(req.user.role)){
            return res.status(403).json({message: "Only business owner and admin allowed to respond."})
        }

        let reviewId = req.params.reviewId
        let response = req.body.response

        // Review ID validation
        if(!isValidId(reviewId)){
            return res.status(400).json({message:"invalid review id"})
        }

        let review = await Review.findByIdAndUpdate(reviewId, {$set:{response:response}}, {new:true})

        // Check if review exists
        if (!review){
            return res.status(404).json({message:"Review not found."})
        }

        return res.status(200).json({message:"Response saved."})
    } catch (error) { 
        return res.status(500).json({message:`Internal server error ${error.message}`})
    }
}

module.exports = {
    creatReview,
    responseReview
}