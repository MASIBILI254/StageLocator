import  User from '../module/userModel.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const userRole = role && ['user', 'admin'].includes(role) ? role : 'user';

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

    
        const newUser = new User({
            username,
            email: req.body.email, 
            password: hash,
            role: userRole, 
        });

        
        await newUser.save();

        res.status(200).json("User has been created");
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error registering the user" });
    }
};
export const login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Find the user by username in MongoDB
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Compare the provided password with the hashed password in the database
      const isMatch = bcrypt.compareSync(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      // Send the response with the token and user information
      res.json({ token, role: user.role, username: user.username });
  
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Login failed', error: err });
    }
  };