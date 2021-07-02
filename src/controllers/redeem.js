import models from '../database/models'
import { redeemValidate } from '../middlewares/validators/redeem'
const { rate,profile } = models

export default async (req,res,next) => {

    const {amount} = req.body
    const userId =  req.user.id
    let reedemer =  req.query.user

    try{

    const rates =  await rate.findOne();
    let user =  await profile.findOne({where: {id:userId}})
    if(reedemer){
        if (user.role == "agent"){
            return res.json({status: 403, message:"Forbidden"})
        }
        reedemer  =  await profile.findOne({where: {id:redeemer}})
    }

    const fees = user.role == "agent" ? rates.agentFees : rates.companyFees
    
    if(user.profit >= rates.profitToRedeem * fees && amount <= user.profit){

        if(user.role == "agent"  || redeemer){ // 
            user =  user.role == "agent"? user : redeemer
            return user.decrement("profit", {by: amount})
                .then(()=>{ // topup the balance of the user, otherwise, it w'd be taken by the  admin account
                        user.increment("balance", {by: amount}) 
                        .then(()=>{
                            res.send({status:201, message: 'successful' })
                        })
                        .catch(()=>{
                            res.send({status:500, message: 'Unseccessful' })
                        })
                })
                .catch(err=>{
                    res.status(500).send(err)
                })
        }

       
        //Just decreement the campany profit, the overall balance will set itself.        
        return profile.decrement('profit',{by: amount, where:{role:'admin'} })
            .then(()=>{
                res.send({status:201, message: 'successful' })
            })
            .catch(()=>{
                res.send({status:500, message: 'Unseccessful' })

            })
                    
    }
    

    res.json({status: 402, message:"insufficient Profits"})
}catch(e){

    res.send(e)

}


}