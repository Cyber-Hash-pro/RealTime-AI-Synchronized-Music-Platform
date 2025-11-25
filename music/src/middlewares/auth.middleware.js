const jwt = require('jsonwebtoken');

const authArtistMiddleware = (req, res, next) => {

    const token = req.cookies.token || req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'artist') {
            return res.status(403).json({ message: 'Access denied. Artist role required.' });
        }
        req.user = decoded;
        next();

    }catch(error){
        return res.status(401).json({ message: 'Invalid token' });
    }




}

const authUserMiddleware = (req,res,next)=>{
    console.log("Auth User Middleware Invoked");
    const token = req.cookies.token || req.headers['authorization'];
    console.log("Token:", token);
    if(!token){
        return res.status(401).json({message:'No token provided'});
        
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    }catch(error){
        return res.status(401).json({message:'Invalid token'});
    }
}


module.exports = {authArtistMiddleware, authUserMiddleware}
