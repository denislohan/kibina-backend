
import axios from 'axios'
import sha from 'sha256'
import moment from 'moment'
import qs from 'qs'
import models from '../database/models'

const {transaction,profile,rate} = models
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
        //console.log(user)
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
         const url = 'https://www.intouchpay.co.rw/api/requestdeposit/' 
         /**
          * subtract the percentages:
          * company fees
          * agent fees
         */
        const {companyFees,agentFees} = await rate.findOne(),
          sendRate = 100 - (agentFees+companyFees),
          toSend = amount*sendRate/100,
          profit = amount*agentFees/100,
          companyProfit = ((amount*companyFees) /100) - 250

        //return res.send({toSend,profit, companyProfit });
        //const pay = process.env.NODE_ENV == 'production' ?


            
        axios({
                method: 'post',
                url,
                data: qs.stringify({
                    username,
                    timestamp: date,
                    amount:Number(''+toSend),
                    withdrawcharge: 0,
                    reason: "Kibina Payment",
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
                  const {requesttransactionid,transactionid,referenceid} = response.data
                  let trans = {
                    requesttransactionid,
                    transactionid,
                    referenceid,
                    receiver,
                    amount,
                    sender,
                    agent,
                    profit,
                    companyProfit
                  }
                  /**create the transaction record in db*/
                  transaction.create(trans)
                    .then((rslt)=>{
                      profile.decrement('balance',{by: amount, where:{id:agent} })
                      profile.increment('profit',{by: profit, where:{id:agent} })
                      profile.increment('profit',{by: companyProfit, where:{role:'admin'} })

                      .then((result)=>{
                        return res.send({receipt:{amount: toSend, receiver:receiver, invoiceNumber:trans.transactionid,sender:sender},status:2001,message:"Successful"})
                      })
                      .catch((e)=>{
                        return res.send({error:{message: "Successful but your balance not updated, inform the Admin",status:203}})
                        // notify dangerous warning || make the balance inactive
                      }) 
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

                  if(process.env.NODE_ENV === "production"){
                    response.data.sending = amount
                    response.data.who= 'the company'
                    return res.send(response.data);
                  }
                  let trans = {
                    requesttransactionid:'1',
                    transactionid:'2',
                    referenceid:'3',
                    receiver,
                    amount,
                    sender,
                    agent,
                    profit,
                    companyProfit
                  }

                  console.log("transaction",trans)
                  transaction.create(trans)
                  .then((rslt)=>{
                    profile.decrement('balance',{by: amount, where:{id:agent} }).then().catch(e =>{console.log("error 1")})
                    profile.increment('profit',{by: profit, where:{id:agent} }).then().catch(e =>{console.log("error 2")})
                    profile.increment('profit',{by: companyProfit, where:{role:'admin'} })

                    .then((result)=>{
                      return res.send({receipt:{amount: toSend, receiver:receiver, invoiceNumber:trans.transactionid,sender:sender},status:2001,message:"Successful"})
                    })
                    // .catch((e)=>{
                    //   return res.send({error:{message: "Successful but your balance not updated, inform the Admin",status:203}})
                    //   // notify dangerous warning || make the balance inactive
                    // }) 
                  })
                  .catch((e)=>{
                    return res.send({error:{error:e,message: "Successful but Transaction not recorded",status:202}})
                  })

                }
                else{
                  return res.send(response.data);
                  
                }
              })
            .catch(err=>{
              return res.send({message: "Payment unseccessful"});

            })
    }

    redeem(req,res){



    }
}

export default Payment;