import User from '../module/userModel.js';
// create a new user

export const createUser = async (req, res) => {
    //check if user exists
    const userExists = await User.findOne({ email: req.body.email });
    if  (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json("User created successfully");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// get a single user
export const getUserById = async (req, res) => {
    //check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch(error){
        res.status(500).json({ message: error.message });
    }
};
// update a user
export const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    } catch (error){

    }
};
// delete a user
export const deleteUser = async (req,res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error){
        res.status(500).json({ message: error.message });
    }
};
