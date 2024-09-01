const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

exports.register = async (req, res) => {
    try {
        const {userName, email, password } = req.body;

        //check if user already exists
        const existingUser = await User.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User Already Exists' });
        }

        // hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create a new User
        await User.CreateUser(userName, email, passwordHash);

        res.status(201).json( {message: 'User Registered Successfully' });
    }
    catch {
        res.status(500).json({ message: 'Server Error' })
    }
};

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findUserByEmail(email);
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials'});
        }
        
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid Credentials' })
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'server error'})
    }
};