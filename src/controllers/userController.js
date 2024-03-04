const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const {TOKEN_SECRET_KEY, ROLES} = require('../config/config')
const {validateUser} = require('../utils/validation')

const registerUser = async (req, res) => {
    try {
        // Validate request body
        const { username, email, password, role } = req.body;
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const {error} = validateUser(req, res)
        if (error){
            return res.status(400).json({ message: error.details[0].message })
        }

        // validating role
        if (!ROLES.includes(role.toUpperCase())){
            return res.status(400).json({message:`${role} is not valid.`})
        }

        // Check if user already exists
        const existingUser = await User.findOne({email: email});
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role.toUpperCase()
        });

        // Save user to database
        const savedUser = await newUser.save();
        return res.status(201).json(savedUser);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};


const login = async (req, res) => {
    try {
        let {email, password} = req.body

        if (!email || !password){
            return res.status(400).json({message: "email and password required."})
        }

        // Check if user exists
        let user = await User.findOne({email})
        if (!user){
            return res.status(401).json({message:"Invalid email or password."})
        }

        let passwordCheck = await bcrypt.compare(password, user.password)
        if (!passwordCheck){
            return res.status(401).json({message:"Invalid email or password."})
        }

        // Create JWT token
        let payload = {
            userId : user._id,
            role : user.role
        }

        const token = jwt.sign(payload, TOKEN_SECRET_KEY, {expiresIn : '3d'})
        res.setHeader('Authorization', `Bearer ${token}`)

        return res.status(200).json({message:"User logged in successfully."})
    } catch (error) {
        console.log("Login Error", error.message)
        res.status(500).json({message:`Internal serevr error --> ${error.message}`})
    }
}


module.exports = {
    registerUser,
    login
};
