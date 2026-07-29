import jwt from 'jsonwebtoken';
//VERIFICATION DU TOKEN
export const verifyJwt=(res,req,next)=>{
    const authHeader=req.headers.authorization || req.headers.Authorization;
if(!authHeader?.startsWith('Bearer ')){
    return res.status(401).json({success:false,message:"Acces refuse. Token manquant."})
}
const token=authHeader.split(' ')[1]
jwt.verify(token, process.env.JWT_SECRET,(err, decoded)=>{
    if(err) return res.status(403).json({success:false,message:"Token invalide ou expire."})
        req.user=decoded;
    next();
})
}