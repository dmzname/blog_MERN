import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});

        if(!user) {
            return res.status(404).json({
                message: 'Authorisation Error'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass) {
            return res.status(404).json({
                message: 'Authorisation Error'
            })
        }

        const {passwordHash, ...userData} = user._doc;

        const token = jwt.sign({
                _id: user._id
            }, 'secret_user',
            {
                expiresIn: "30d"
            })

        res.json({
            ...userData,
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Failed to login."})
    }
}

export const signup = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        })

        const user = await doc.save();

        const {passwordHash, ...userData} = user._doc;

        const token = jwt.sign({
                _id: user._id
            }, 'secret_user',
            {
                expiresIn: "30d"
            })

        res.json({
            ...userData,
            token
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Failed to signup."})
    }
}

export const userDataEdit = async (req, res) => {
    try {
        const user = await UserModel.findByIdAndUpdate({_id: req.body._id},{
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl
        }, {new: true});

        const {passwordHash, ...userData} = user._doc;

        res.json({...userData});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Failed to signup."})
    }
}

export const passwordEdit = async (req, res) => {
    try {
        const {newPassword, confirmedPassword, oldPassword} = req.body;
        if(newPassword !== confirmedPassword) {
            return res.status(404).json({ message: "Failed to update password" });
        }

        const id = jwt.verify(req.headers.authorization, 'secret_user' ,{ algorithm: 'HS256' }, function(err, decoded) {
            if (err) {
                console.log(err);
                return res.status(404).json({message: "Failed to update password."})
            }
            return decoded._id;
        });

        const user = await UserModel.findOne({_id: id});

        if(!user) {
            return res.status(404).json({message: "Failed to update password."})
        }

        const isValidPass = await bcrypt.compare(oldPassword, user._doc.passwordHash);

        if(!isValidPass) {
            return res.status(404).json({
                message: 'Password Wrong.'
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt)

        await UserModel.updateOne({_id: id},{
            passwordHash: hash
        });

        res.json({message: 'success'});

    } catch (err) {
        // console.log(err);
        res.status(500).json({message: "Failed to update password."})
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if(!user) {
            return res.status(404).json({
                message: "User not found!"
            })
        }
        const {passwordHash, ...userData} = user._doc;
        res.json(userData)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'No access',
        })
    }
}