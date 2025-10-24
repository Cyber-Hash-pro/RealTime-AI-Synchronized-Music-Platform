const {body , validationResult}= require('express-validator');

const validate = async(req,res,next)=>{
 const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }
    next();

}


const registerValidation = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('fullName.firstName').notEmpty().withMessage('First name is required'),
    body('fullName.lastName').notEmpty().withMessage('Last name is required'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
    validate
];

const loginValidation=[
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
]
module.exports = {
    registerValidation,
    loginValidation
}