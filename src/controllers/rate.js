import models from '../database/models'

const { rate } = models

export default class Rate{


    async findOne(_,res){

        try{
        let rates = await rate.findOne();
            if(rates)
                res.json({status:200, data: rates})
            else{
                res.json({status:404, error: 'no rate set'})
            }
        } catch(err) {
            res.json({status:5000, error: err})
        }

    }
    async update(req,res){
        const {currency, companyFees, agentFees} =  req.body
        let rates = await rate.findOne()

        if(rates)
            rates.update({currency, companyFees, agentFees})
                .then(()=>{
                        res.json({status:200,message: "Updated successfuly"})
                })
                .catch(()=>{
                    res.json({status:500,message: "Error updating"})
                })
        else
            rate.create({currency, companyFees, agentFees})
                .then(data => {
                    res.json({status:200,message: "created successfuly"})
                })
                .catch(err =>{
                    res.json({status:500,message: "Error Creating"})
                })
    }
}
