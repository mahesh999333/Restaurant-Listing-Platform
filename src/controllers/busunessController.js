const mongoose = require('mongoose')
const Business = require('../models/business')
const User = require("../models/user")
const Review = require("../models/review")
const {CREATELISTINGROLE, UPDATELISTINGROLE, DELETELISTINGROLE} = require("../config/config")
const {validateCreateListing, validateUpdateListing, isValidId} = require("../utils/validation")


const createListing = async (req, res) => {
    try {
        // validating role
        if (!CREATELISTINGROLE.includes(req.user.role)) {
            return res.status(403).json({ message: 'Unauthorized. Only Business Owners and Admin can create listings.' });
        }

        // data validation
        const error = validateCreateListing(req, res)
        if(error){
            return res.status(400).json({ message: error.details[0].message });
        }

        let {name, phone, city, address, images} = req.body
        
        const newBusiness = new Business({
            name,
            phone,
            city,
            address,
            images,
            owner: req.user._id
          });
        
        // saving a new business listing
        const savedBusiness = await newBusiness.save()
        res.status(201).json(savedBusiness);

    } catch (error) {
        return res.status(500).json({message:`Internal server error --> ${error.message}`})
    }
}


const getAllListings = async (req, res) => {
    try {
        const {name, city, ownerName} = req.query
        const filter = {isDeleted:false, $or:[]}

        if (name) {
          filter['$or'].push( { name: {$regex: new RegExp(name, 'i') }} )
        }
        if (city) {
            filter['$or'].push( { city: {$regex: new RegExp(city, 'i') }} )
        }
        if (ownerName) {
          const users = await User.find({ username: new RegExp(ownerName, 'i') })
          const ownerIds = users.map(user => user._id) // Extract user IDs for filtering
          filter['$or'].push({owner: { $in: ownerIds }})
        }
        const businesses = await Business.find(filter).populate('owner', 'username -_id').select({_id:0, __v:0,isDeleted:0});
        res.status(200).json(businesses);
    } catch (error) {
        return res.status(500).json({message:`Error fetching business listings --> ${error.message}`})
    }
}


const updateListing = async (req, res) => {
    try {
        // validating role
        if (!UPDATELISTINGROLE.includes(req.user.role)) {
            return res.status(403).json({ message: 'Unauthorized. Only Business Owners and Admin can update listings.' });
        }

        // validating data
        const error = validateUpdateListing(req, res)
        if (error){
            return res.status(400).json({ message:`validation error ${error.details[0].message}` });
        }

        let {name, phone, city, address, images, ownerName} = req.body
        let userId = req.user._id
        let listingId = req.params.listingId
        let update = {}
        if (name) update.name = name
        if (phone) update.phone = phone
        if (city) update.city = city
        if (address) update.address = address
        if (images) update.images = images

        // filter criteria
        let filter = {}
        if (req.user.role == "ADMIN"){
            filter["_id"] = listingId
        }else{
            filter["_id"] = listingId
            filter["owner"] = userId
        }

        // updating business listing
        const updatedBusiness = await Business.findOneAndUpdate(filter, update, { new: true }).select({_id:0, __v:0, isDeleted:0})
        if (!updatedBusiness) {
            return res.status(404).json({ message: 'Business listing not found.' });
        }
        
        // updating owner name if given
        if (ownerName){
            try {
                await User.findByIdAndUpdate(updatedBusiness.owner, { $set: { username: ownerName } })
            } catch (error) {
                console.error("Error updating owner name:", err.message)
            }
        }

        return res.status(200).json(updatedBusiness);

    } catch (error) {
        return res.status(500).json({message:`Error updating business listings --> ${error.message}`})
    }
}


const deleteListing = async (req, res) => {
    try {
        // validating role
        if (!DELETELISTINGROLE.includes(req.user.role)) {
            return res.status(403).json({ message: 'Unauthorized. Only Admin can delete listings.' });
        }

        const listingId = req.params.listingId
        if (!listingId) {
            return res.status(400).json({ message: 'Missing listing ID.' });
          }
      
        if(!isValidId(listingId)){
            return res.status(400).json({message:"invalid listing id"})
        }

        // soft deleting business listing
        const deletedBusiness = await Business.findByIdAndUpdate(listingId, {$set: {isDeleted:true}}, {new:true})
    
        if (!deletedBusiness) {
          return res.status(404).json({ message: 'Business listing not found.' })
        }

        // also delete the related reviews
        await Review.deleteMany({business:listingId})
    
        res.status(200).json({ message: 'Business listing deleted successfully.' })
    } catch (error) {
        return res.status(500).json({message:`Error while deleting business listings --> ${error.message}`})
    }
}


module.exports = {
    createListing,
    getAllListings,
    updateListing,
    deleteListing
}