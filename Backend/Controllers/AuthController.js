import User from '../module/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// login user
export const loginuser = async (req,res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}