import models from '../database/models'

const {transaction} = models

 class Transaction {
     retrieveAll(req,res){
         const {id,role} = req.user
         transaction.findAll( role === 'admin' ? {} : {where:{agent:id}})
            .then((results)=>{
                if(role == 'agent'){
                    //delete the compamy profit.
                }
                return res.status(200).send({user_role: role, results});
            })
            .catch((e)=>{
                return res.send({error:{message:'cant load transactions',status:500}});
            })
     }
}

export default Transaction