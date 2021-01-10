import models from '../database/models'
const { rate,profile } = models

export default async (req,res,next) => {

    const {amount} = req.body
    const userId =  req.user.id

    const rates =  await rate.findOne();
    const user =  await profile.findOne({where: {id:userId}})

    const fees = user.role == "agent" ? rates.agentFees : rates.companyFees
    
    if(user.profit >= rates.profitToRedeem * fees && amount <= user.profit){

        if(user.role == "agent" ) // 
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


}