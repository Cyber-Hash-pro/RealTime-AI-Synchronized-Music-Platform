const UserModel = require('../model/user.model.js')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {publicToQueue}   = require('../broker/rabbit.js')
 const register = async(req,res)=>{
    const {email,fullName:{firstName,lastName},password} = req.body;
    try {
        const existingUser = await UserModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'User already exists'})
        }
        const hashedPassword =  await bcrypt.hash(password,10);
        const newUser = await UserModel.create({
            email:email,
            fullName:{
                firstName:firstName,
                lastName:lastName
            },
            password:hashedPassword
        })
    await publicToQueue('user_created',{ // queue name  user_created  data dekne ke liye on LavinMQ website  LavinMQ Manager me jao dashbord me queue me jao waha dekh sakte ho kinte kyu create huv hae 
        userId:newUser._id,
        fullName:`${newUser.fullName.firstName} ${newUser.fullName.lastName}`,
        email:newUser.email,
        type:'WELCOME_EMAIL'
       })  

        const token = jwt.sign({
            id:newUser._id,
            role:newUser.role,
            fullName:newUser.fullName
        },process.env.JWT_SECRET,{expiresIn:'2d'});
            
        res.cookie('token',token)
        return res.status(201).json({message:'User registered successfully', user:{
            id:newUser._id,
            email:newUser.email,
            fullName:newUser.fullName,
            role:newUser.role
        }})
        

    }catch (error) {   
        console.log('Error during user registration:', error);
        return res.status(500).json({message:'Internal server error'}) 
    }

}
//respnse me aapko use karn hae res.redirect(;'http://localhost:5137)x 
const GoogleAuthCallback = async (req, res) => {
    const user = req.user;
    // console.log(user)
    // scoper me definde kiya sara data show hoga kidar req.user me 
    const ifUserAlerdyExists = await UserModel.findOne({     
        $or:[
            {email:user.emails[0].value}, // emails array me se first email le raha h jo milta hae googl ke api se req.user jo google deta hae eseliy emails[0].value
            { googleId:user.id}
        ]
    });
   
        if(ifUserAlerdyExists){
            // User already exists, generate token
            const token = jwt.sign({
                id:ifUserAlerdyExists._id,
                role:ifUserAlerdyExists.role,
                fullName:ifUserAlerdyExists.fullName
            },process.env.JWT_SECRET,{expiresIn:'2d'});
                
            res.cookie('token',token)
            // return res.status(200).json({message:'User logged in successfully', user:{
            //     id:ifUserAlerdyExists._id,
            //     email:ifUserAlerdyExists.email,
            //     fullName:ifUserAlerdyExists.fullName,
            //     role:ifUserAlerdyExists.role
            // }})
             return res.redirect('http://localhost:5137') // frontend ka url jaha redirect karna hae
        }

       const newUser =  await UserModel.create({
        email:user.emails[0].value,
        fullName:{
            firstName:user.name.givenName,
            lastName:user.name.familyName
        },
        googleId:user.id
       });
         await publicToQueue('user_created',{ // queue name  user_created  data dekne ke liye on LavinMQ website  LavinMQ Manager me jao dashbord me queue me jao waha dekh sakte ho kinte kyu create huv hae 
        userId:newUser._id,
        fullName:`${newUser.fullName.firstName} ${newUser.fullName.lastName}`,
        email:newUser.email,
        type:'WELCOME_EMAIL'
       })  


       const token = jwt.sign({
        id:newUser._id,
        role:newUser.role,
        fullName:newUser.fullName        
    },process.env.JWT_SECRET,{expiresIn:'2d'});
        
    res.cookie('token',token)
    // return res.status(201).json({message:'User registered successfully', user:{
    //     id:newUser._id,
    //     email:newUser.email,
    //     fullName:newUser.fullName,
    //     role:newUser.role
    // }
    //    }) 
    return res.redirect('http://localhost:5137') // frontend ka url jaha redirect karna hae


}
const login = async(req,res)=>{
    const {email,password} = req.body;
    try {
        const existingUser = await UserModel.findOne({ email });
        if(!existingUser){
            return res.status(404).json({message:'User not found'});
        }
        const isMatch = await bcrypt.compare(password,existingUser.password);
        if(!isMatch){
            return res.status(401).json({message:'Invalid credentials'});
        }
        const token = jwt.sign({
            id:existingUser._id,
            role:existingUser.role,
            fullName:existingUser.fullName
        },process.env.JWT_SECRET,{expiresIn:'2d'});
        res.cookie('token',token);
        return res.status(200).json({message:'User logged in successfully', user:{
            id:existingUser._id,
            email:existingUser.email,
            fullName:existingUser.fullName,
            role:existingUser.role
        }});
    } catch (error) {
        console.log('Error during user login:', error);
        return res.status(500).json({message:'Internal server error'});
    }
}

module.exports = {
    register,
    GoogleAuthCallback,
    login
};