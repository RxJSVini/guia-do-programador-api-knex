const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwtConfig')

module.exports = (req, res, next) =>{
 try {
    const authToken = req.headers.authorization;

    if(authToken != undefined){
        const [, baerer ]= authToken.split(" ")
        const verifyToken = jwt.verify(baerer, secret)
        if(verifyToken){
            return next()
        }
        
    }
    
 } catch (error) {
    return res.status(401).json({authorization:'Token inválido!'})
 }
    
    

}