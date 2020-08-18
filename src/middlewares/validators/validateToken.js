import TokenHelper from '../../utils/authHelpers/token_util'


export default (req,res,next)=>{
    try{
    const token = req.headers.authorization || req.headers.auth

    const tokenData = TokenHelper.decodeToken(token.split('Bearer ')[1] || 'no Token', process.env.JWTSK)
    req.user = tokenData
    const {id,username,role} = tokenData
    res.header('token',TokenHelper.generateToken({id,username,role}, process.env.JWTSK))
    next();
    } catch(e){
        return res.send({error:
            {
                message:'unauthorized',
                status:401
            }
        })
        //next(e)
       
    }

}
