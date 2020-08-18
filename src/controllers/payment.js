
import axios from 'axios'
import sha from 'sha256'
import moment from 'moment'
import qs from 'qs'
import models from '../database/models'

const {transaction,profile} = models
class Payment{
    async process(req,res){
      let k =0;

      const {sender,receiver,amount}= req.body,
          agent = req.user.id
      /**
       * get the balance of the agent
       */
      const user = await profile.findOne({where:{id:agent}})
      var balance
      if(user)
        balance = user.balance
      /**
       * checking the sending amount not less than the balance
       */
      if(amount > balance){
        return res.status(409).json({
          status:409,
          message: "insufficient balance on your account",
          sending:amount,
          balance
        })
      }

        let partnerpassword = process.env.partnerpassword,
         accountno=process.env.accountno,
         username=process.env.username,
         date = moment(new Date()).format('YMDHms'),
         password=sha(username+accountno+partnerpassword+date)

            axios({
                method: 'post',
                url: 'https://www.intouchpay.co.rw/api/requestdeposit/',
                data: qs.stringify({
                    username,
                    timestamp: date,
                    amount:Number(amount),
                    withdrawcharge: 0,
                    reason: "Testing",
                    sid: "3",
                    password,
                    mobilephone: Number('25'+receiver),
                    requesttransactionid: Math.floor(Math.random()*90000) + 10000
                }),
                headers: {
                  'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
              })
              .then((response)=>{

                if(response.data.responsecode == '2001'){
                  
                  const {requesttransactionid,transactionid,referenceid} = response
                  let trans = {
                    requesttransactionid,
                    transactionid,
                    referenceid,
                    receiver,
                    amount,
                    sender,
                    agent,
                  }
                  /**create the transaction record in db*/
                  transaction.create(trans)
                    .then((rslt)=>{
                      profile.decrement('balance',{by: amount, where:{id:agent} })
                      .then((result)=>{
                        return res.send({message:"Successful"})
                      })
                      .catch((e)=>{
                        return res.send({error:{message: "Successful but your balance not updated, inform the Admin",status:203}})
                      }) // notify dangerous warning || make the balance inactive
                    })
                    .catch((e)=>{
                      return res.send({error:{message: "Successful but Transaction not recorded",status:202}})
                    })
                  /**
                   * update the agent's balance
                   */
                 
                }
                /**
                 * if the company has no funds
                 */
                else if(response.data.responsecode==='1108'){
                  response.data.sending = amount
                  response.data.who= 'the company'
                  return res.send(response.data);
                }
                else{
                  return res.send(response.data);

                }
              })
    }
}

export default Payment;