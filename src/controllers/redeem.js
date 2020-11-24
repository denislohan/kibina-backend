import models from '../database/models'
const { rate,profile } = models

export default async (req,res,next) => {

    const {amount} = req.body
    const userId =  req.user.id

    const rates =  await rate.findOne();
    const user =  await profile.findOne({where: {id:userId}})

    const fees = user.role == "agent" ? rates.agentFees : rates.companyFees
    
    if(user.profit >= rates.profitToRedeem * fees ){
        return user.decrement("profit", {by: amount})
            .then(()=>{

                if(user.role == 'agent')
                    user.increment("balance", {by: amount})
                    .then(()=>{
                        res.send({status:201, message: 'successful' })
                    })
                    .catch()
                else{
                    res.send({status:201, message: 'successful' })

                }
            })
            .catch(err=>{
                res.status(500).send(err)
            })
    }
    

    res.json({status: 402, message:"insufficient Profits"})


}