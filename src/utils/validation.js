const Joi = require('joi');
const mongoose = require('mongoose')


const userSchema = Joi.object({
  username: Joi.string().trim().required().min(3).max(50).alphanum().message({
    "string.base": `"username" should be a string`,
    "string.empty": `"username" cannot be empty`,
    "string.min": `"username" should be at least 3 characters long`,
    "string.max": `"username" should be at most 50 characters long`,
    "string.alphanum": `"username" can only contain letters and numbers`,
  }),
  email: Joi.string().trim().required().email().message({
    "string.base": `"email" should be a string`,
    "string.empty": `"email" cannot be empty`,
    "string.email": `"email" should be a valid email address`,
  }),
  password: Joi.string().trim().required().min(6).message({
    "string.base": `"password" should be a string`,
    "string.empty": `"password" cannot be empty`,
    "string.min": `"password" should be at least 6 characters long`,
  })
});


exports.validateUser = (req, res) =>{
  const {error} = userSchema.validate(req.body)
  if (error) {
    return error
  }
}

const createListingSchema = Joi.object({
  name: Joi.string().trim().required().min(1).max(50),
  phone: Joi.string().trim().required()
    .length(10) // Ensure 10 digits
    .pattern(/^[6789]\d+$/, 'Phone number must start with 6, 7, 8, or 9 and be numeric'),
  city: Joi.string().trim().required().min(3).max(50),
  address: Joi.string().trim().required().min(5).max(255),
  images: Joi.array().items(Joi.string().uri()), // (optional)
});

exports.validateCreateListing = (req, res) => {
  const { error } = createListingSchema.validate(req.body);
  if (error) {
    return error
  }
}


const updateListingSchema = Joi.object({
    name: Joi.string().trim().min(1).max(50),
    phone: Joi.string().trim()
      .length(10) // Ensure 10 digits
      .pattern(/^[6789]\d+$/, 'Phone number must start with 6, 7, 8, or 9 and be numeric'),
    city: Joi.string().trim().min(3).max(50),
    address: Joi.string().trim().min(5).max(255),
    images: Joi.array().items(Joi.string().uri()), // (optional)
    ownerName : Joi.string().trim().min(1).max(50),
  });
  
  exports.validateUpdateListing = (req, res) => {
    const { error } = updateListingSchema.validate(req.body);
    if (error) {
      return error
    }
  }


const reviewSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  comment: Joi.string().trim().allow(null),
})

exports.validatingReview = (req, res) => {
  const {error} = reviewSchema.validate(req.body)
  if (error) {
    return error
  }
}


exports.isValidId = (id) => {
  if(!mongoose.Types.ObjectId.isValid(id)){
    return false
  }
  return true
}