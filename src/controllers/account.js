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
            this.topUp = this.topUp.bind(this)
        
    }
    async profile(req,res){
       
        try{
            let id,companyBal,transactions =[],profiles = []
            const user = req.params
            await req.app.get('redis').get('balance', (err, balance)=>{
                this.devBalance = balance
            })

            if(user.id) /** id viewing a different profile */
                id = user.id
            else /** if viewing own profile */
                id = req.user.id

            const agent = await profile.findOne({where:{id}})

            if (agent){
                transactions = await transaction.findAll( agent.role  != "admin"? {where:{agent:id}}: {})
                delete agent['dataValues'].password

                if(agent.role === 'admin'){
                    let sold = 0, profits = 0, companyProfAdded =false;
                    profiles = await profile.findAll()

                    if(profiles.length > 0){
                        // profiles.map(prof => {
                        //     sold+=prof.balance;
                        //     delete prof['dataValues'].password
                        // })
                        profiles.map(prof => {
                            if(prof.role === 'admin'){
                                if(!companyProfAdded) {// addin company Profit once
                                    companyProfAdded = true;
                                    sold+=(prof.balance+prof.profit)
                                }
                            }  
                            else{
                                sold+=(prof.balance+prof.profit);
                            }
                            delete prof['dataValues'].password

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

             console.log(this.devBalance);
             return process.env.NODE_ENV == 'production' ? balData.data.balance : this.devBalance
             
    }

    async topUp(req,res){
        try{
        const  {amount,user} = req.body
        let sold = 0;

        let companyBal = await this.retrieveBal(),
            profiles = await profile.findAll(),
            companyProfAdded = false
                    if(profiles.length > 0){
                        profiles.map(prof => {
                            if(prof.role === 'admin'){
                                if(!companyProfAdded) {// addin company Profit once
                                    companyProfAdded = true;
                                    sold+=(prof.balance+prof.profit)
                                }
                            }  
                            else{
                                sold+=(prof.balance+prof.profit);
                            }
                            delete prof['dataValues'].password

                        })
                    }
        companyBal-=sold

        /**
         * validate the account balance of the company by calling intouch pay API
         */

        /**
         * retrieve the agent
        */
       console.log(Number(amount), companyBal)
       console.log(sold)
       if(Number(amount) > companyBal)
            return res.json({status: 409, message: "No Funds"})

        const agent = await profile.findOne({where:{id:user}})
        if(!agent){
            return res.send({error:{message:'user not found',status:404}})
        }

        if(agent.role === 'admin'){
            return res.send({error:{message:'can not sell to the admin',status:403}})
        }
        await profile.increment('balance',{by: amount, where:{id:user} })
        return res.status(200).send({message:'Successful'})
    }catch(e){
        return res.status(500).send({error:e})
    }
    }
}

export default Payment;