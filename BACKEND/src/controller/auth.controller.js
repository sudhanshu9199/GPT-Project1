const userModel = require('../models/user.models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
    const { fullName: { firstName, lastName }, email, password} = req.body;

    const isUserAlreadyExist = await userModel.findOne({ email });
    if (isUserAlreadyExist) {
        res.status(400).json({
            message: 'User already exists'
        })
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
        fullName: {
            firstName, lastName
        },
        email,
        password: hashPassword
    })

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token)

    res.status(201).json({
        message: 'User registered successfully',
        user: newUser,
        token
    })
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    const userAccount = await userModel.findOne({
        email
    })
    if (!userAccount) {
        return res.status(404).json({
            message: "Invalid credentials"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, userAccount.password);

    if (!isPasswordValid) {
        return res.status(404).json({
            message: "Invalid credentials",
        })
    }

    const token = jwt.sign({ id: userAccount._id, email: userAccount.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token);
    res.status(200).json({
        message: 'Login successful',
        user: {
            id: userAccount._id,
            email: userAccount.email,
            fullName: userAccount.fullName
        },
        token
    })
}
module.exports = { registerUser, loginUser };