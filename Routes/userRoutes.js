const router = require("express").Router();
const User = require("../Models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//  SIGN-IN API's --->>>
router.post("/sign-in", async(req, res) => {
    try {
        const { username } = req.body;
        const { email } = req.body;
        const existingUser = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message:"Username already exists"});
        }
        else if(username.length < 3) {
            return res.status(400).json({ message:"Username should have more than 3 characters"});
        }
        if(existingEmail) {
            return res.status(400).json({ message:"Email id already exists"});
        }

        const hashPass = await bcrypt.hash(req.body.password , 10);

        const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashPass
        });
        await newUser.save();
        return res.status(200).json({messege: "SignedIn successfully"});
    } 
    catch (error) {
        console.log(error);
        res.status(400).json({ message:"Internal server error"});    
    }
});

// LOGIN --->>>
router.get("/log-in", async(req, res) =>{
    const { username , password } = req.body;
    const existingUser = await User.findOne({ username });
    if( !existingUser ) {
        return res.status(400).json({ message:"Invalid Inputs"});
    }
    bcrypt.compare(password, existingUser.password, (err, data) => {
        if(data) {
            const authClaims = [ { name: username }, { jti: jwt.sign({} , "tomAYU" )} ];
            const token = jwt.sign({authClaims}, "tomAYU", { expiresIn: "2d" });
            res.status(200).json({id: existingUser._id, token: token});
        }
        else {
            return res.status(400).json({ message:"Invalid Inputs"});
        }
    });
});

module.exports = router;