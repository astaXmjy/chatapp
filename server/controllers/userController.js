const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET ;    
    return jwt.sign( {_id}, jwtkey, { expiresIn: '3d'} )
}

const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        let user = await userModel.findOne({email});

        if(user) {
            return res.status(400).json("User already registered")
        }
        if(!name || !email || !password) {
            return res.status(400).json("All fields are required")
        }
        if(!validator.isEmail(email)) {
            return res.status(400).json("Invalid email")
        }
        if(!validator.isStrongPassword(password)) {
            return res.status(400).json("Password must be strong");
        }

        user = new userModel({name, email, password});

        user.password = await bcrypt.hash(user.password, 10);
        await user.save();

        const token = createToken(user._id)

        res.status(200).json({_id: user._id, name, email, token});

    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

const loginUser = async ( req, res ) => {
    try {
        const {email, password} = req.body;
        let user = await userModel.findOne({email});
        
        if(!user) {
            return res.status(400).json("Plz signup first")
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword) {
            return res.status(400).json("Invalid email or password")
        }

        const token = createToken(user._id);
        res.status(200).json({_id: user._id, name: user.name, email, token});

    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

const findUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await userModel.findById(userId);
        res.status(200).json(user);

    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

const getAllUsers = async (req, res) => {
    try {
        const user = await userModel.find();
        res.status(200).json(user);

    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

module.exports = { registerUser, loginUser, findUser, getAllUsers } ;