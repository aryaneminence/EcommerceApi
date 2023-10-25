const authorizationToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(400).json({ message: "User not found" });
    jwt.verify(token, '123', (err, decoded) => {
        if (err) return res.status(403).json({ message: "err" });
        req.user = decoded;
        next();
    });
    
};





module.exports=authorizationToken