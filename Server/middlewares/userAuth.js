import jwt from "jsonwebtoken";
// The authMiddleware function is a middleware that checks for the presence of a JWT token in the request cookies. If a token is found, it verifies the token using the secret key and attaches the decoded user information to the request object. If the token is missing or invalid, it returns an unauthorized error response.  

const userAuth = (req, res, next) => {
    const {token} = req.cookies;
    // ...existing code...
    
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }  
    try {
        const tokendecode = jwt.verify(token, process.env.JWT_SECRET);
        
        if(tokendecode.id){
            req.userId = tokendecode.id;
            if (!req.body) req.body = {};
            req.body.userId = tokendecode.id;
        }
        else{
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
        }
        next();


    } catch (error) {
        // ...existing code...
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
};

export default userAuth;