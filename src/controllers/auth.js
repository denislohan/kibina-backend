import models from '../database/models'
import erroPersor from '../utils/sequelizeErrorParser/index'
import bcrypt from 'bcrypt'
import TokenHelper from '../utils/authHelpers/token_util'
import {parseUser} from '../utils/authHelpers/authStrategy'

const {profile} = models

 class Auth {
     constructor(){
         this.login=this.login.bind(this)
         this.signup=this.signup.bind(this)
     }

    signup(req,res){
        req = parseUser(req)
        bcrypt.hash(req.body.password,10,(hashingError,hash)=>{
            if(!hashingError){
                req.body.password = hash
                profile.create(req.body)
                    .then((data)=>{
                            return res.status(201).json(
                                {
                                status:201,
                                token: TokenHelper.generateToken(data,process.env.JWTSK)
                                }
                            )
                    })
                    .catch((err)=>{
                        if(erroPersor(err) == 'email must be unique' && req.isSocial)
                            return this.signin(req,res)
                        return res.status(409).json({"error":erroPersor(err)})
                    })
            }
            else{
                return res.status(409).send(hashingError)
            }
        })
    }

        login(req,res){
        var authenticated
        
        const {username,password} = req.body;
            if(!username || !password){
                return res.json({"error":"Provide both username and password Please"})
            }

            let data = req.isSocial? {provider_id} : {username},
                user_password = req.isSocial?  req.user.provider+req.user.id : password
            profile.findOne({
                where:data
            }).then(async (data)=>{
                if(data)
                    authenticated = await bcrypt.compare(user_password,data.password,null)
                if(authenticated){

                    return res.status(201).json(
                        {
                        token: TokenHelper.generateToken(data,process.env.JWTSK)
                        })
                    }
                    return res.json({ status:401,error:{"Loggin Failure": "Wrong Credentials"}
                        })
            })
            .catch((err)=>{
                return res.status(409).json({"error":erroPersor(err)})
            })

    }
}

export default Auth