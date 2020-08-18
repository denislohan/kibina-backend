import models from '../database/models'
import moment from 'moment'
import sha from 'sha256'
import axios from 'axios'
import qs from 'qs'
const {profile,transaction} = models
class Payment{
    constructor(){
            this.retrieveBal = this.retrieveBal.bind(this)
            this.profile = this.profile.bind(this)

    }
    async profile(req,res){
       
        try{
            let id,companyBal,transactions =[],profiles = []
            const user = req.params

            if(user.id) /** id viewing a different profile */
                id = user.id
            else /** if viewing own profile */
                id = req.user.id

            const agent = await profile.findOne({where:{id}})

            if (agent){
                transactions = await transaction.findAll(

                    agent.role  != "admin"? {where:{agent:id}}: {}
                    )
                delete agent['dataValues'].password

                if(agent.role === 'admin'){
                    let sold = 0
                    profiles = await profile.findAll()
                    if(profiles.length > 0){
                        profiles.map(prof => {
                            sold+=prof.balance;
                        })
                    }
                    /**
                     * get the company balance
                     * 
                     */

                    companyBal = await this.retrieveBal()

                    // this the balance that admin is allowed to sell to agents
                    agent.balance = (companyBal - sold).toFixed(2)
                }
                return res.send({agent,transactions,profiles})
            }

            else{
                return res.send({error:{status:404,data:"user not found"}})
            }
        }catch(e){
            console.log(e)
            return res.send({error:{
                status: 500,
                e

            }})
        }
    }

     async retrieveBal(){
        let balData,partnerpassword = process.env.partnerpassword,
            accountno=process.env.accountno,
            username=process.env.username,
            date = moment(new Date()).format('YMDHms'),
            password=sha(username+accountno+partnerpassword+date)

           balData =  await axios({
               method: 'post',
               url: 'https://www.intouchpay.co.rw/api/getbalance/',
               data: qs.stringify({
                   username,
                   timestamp: date,
                   password,
               }),
               headers: {
                 'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
               }
             })

             console.log('balance==>',balData.data.balance)

             return balData.data.balance
             
    }

    async topUp(req,res){
        try{
        const {amount,user} = req.body
        /**
         * validate the account balance of the company by calling intouch pay API
         */

        /**
         * retrieve the agent
        */
        const agent = await profile.findOne({where:{id:user}})
        if(!agent){
            return res.send({error:{message:'user not found',status:404}})
        }
        await profile.increment('balance',{by: amount, where:{id:user} })
        return res.status(200).send({message:'Successful'})
    }catch(e){
        return res.status(500).send({error:e})
    }
    }
}

export default Payment;