import models from '../database/models'

const {transaction} = models

 class Transaction {
     retrieveAll(req,res){
         const {id,role} = req.user
         console.log("user ==", id)

         transaction.findAll( role === 'admin' ? {} : {where:{agent:id}})
            .then((results)=>{
                return res.status(200).send(results);
            })
            .catch((e)=>{
                return res.send({error:{message:'cant load transactions',status:500}});
            })
     }
}

export default Transaction