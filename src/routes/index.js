import express from 'express'
import Test from '../controllers/test'
import Payment from '../controllers/payment'
import Auth from '../controllers/auth'
import Account from '../controllers/account'
import Transaction from '../controllers/transaction'
import Rate from '../controllers/rate'
import redeem from '../controllers/redeem'





import { signupValidate, signinValidate} from '../middlewares/validators/auth';
import { processValidate} from '../middlewares/validators/process';
import validateToken from '../middlewares/validators/validateToken'
import {isAdmin,isOwner} from '../middlewares/validators/access'
import {topUpValidate} from '../middlewares/validators/account'
import {rateValidate} from '../middlewares/validators/rate'
import {redeemValidate} from '../middlewares/validators/redeem'



const router = express.Router(),
    test = new Test(),
    payment = new Payment(),
    auth = new Auth(),
    account = new Account(),
    transaction = new Transaction(),
    rate =  new Rate();

    /**
     * @swagger
     * /api/test:
     *  get:
     *      description: Use to test the service connection
     *      responses:
     *          '200':
     *              description: Service is on
    */
    router.get('/test',test.test)
    /**
     * @swagger
     * /api/signup:
     *  post:
     *      description: Use for signup local startegy
     *      tags: [Authentication]
     *      parameters:
     *          -   in: body
     *              name: user_crenrials
     *              description: The user to create.
     *              schema:
     *                  type: object
     *                  properties:
     *                      email:
     *                          type: string
     *                          required: true
     *                      username:
     *                          type: string
     *                      password:
     *                          type: string
     *      responses:
     *          '201':
     *              description: Created Successfully
     */         
    router.post('/signup',signupValidate,auth.signup)
    /**
     * @swagger
     * /api/login:
     *  post:
     *      description: Use for login with email and password
     *      tags: [Authentication]
     *      parameters:
     *          -   in: body
     *              name: user_crenrials
     *              description: The user to create.
     *              schema:
     *                  type: object
     *                  properties:
     *                      username:
     *                          type: string
     *                      password:
     *                          type: string
     *      responses:
     *          '200':
     *              description: Logged in Successfully
     */    
    router.post('/login',signinValidate,auth.login)
    /**
     * @swagger
     * /api/payment:
     *  post:
     *      tags: [Process Payment]
     *      parameters:
     *          -   in: body
     *              name: payment
     *              schema:
     *                  type: object
     *                  properties:
     *                      amount:
     *                          type: string
     *                      receiver:
     *                          type: string
     *                      sender:
     *                          type: string
     *          -   in: header
     *              name: Auth
     *              required: true
     *              type: string
     *              description: token to authenticate user to the resources
     *      description: Use Viewing a profile
     *      responses:
     *          '200':
     *              description: successful
     *          '401':
     *              description: Unauthorized
     */ 
    router.post('/payment',validateToken, processValidate,payment.process)
    /**
     * @swagger
     * /api/topup:
     *  post:
     *      tags: [Process Payment]
     *      parameters:
     *          -   in: body
     *              name: payment
     *              schema:
     *                  type: object
     *                  properties:
     *                      amount:
     *                          type: string
     *                      receiver:
     *                          type: string
     *                      sender:
     *                          type: string
     *          -   in: header
     *              name: Auth
     *              required: true
     *              type: string
     *              description: token to authenticate user to the resources
     *      description: Use Viewing a profile
     *      responses:
     *          '200':
     *              description: successful
     *          '401':
     *              description: Unauthorized
     *          '403':
     *              description: Forbiden
     */ 
    router.post('/topup',validateToken,isAdmin,topUpValidate,account.topUp)

    /**
     * @swagger
     * /api/profile:
     *  get:
     *      tags: [Profile]
     *      description: viewing other's profile
     *      parameters:
     *          -   in: header
     *              name: Auth
     *              required: true
     *              type: string
     *              description: token to authenticate user to the resources
     *      responses:
     *          '200':
     *              description: successful
     *          '401':
     *              description: Unauthorized
     *          '404':
     *              description: User not found
     */ 
    router.get('/profile',validateToken,account.profile)
    /**
     * @swagger
     * /api/profile/{id}:
     *  get:
     *      tags: [Profile]
     *      description: viewing other's profile
     *      parameters:
     *          -   in: header
     *              name: Auth
     *              required: true
     *              type: string
     *              description: token to authenticate user to the resources
     *      responses:
     *          '200':
     *              description: successful
     *          '401':
     *              description: Unauthorized
     *          '403':
     *              description: forbiden [requires higher level access]
     *          '404':
     *              description: User not found
     */ 
    router.get('/profile/',validateToken,isAdmin,account.profile)
    
    /**
     * @swagger
     * /api/transactions:
     *  get:
     *      tags: [Transactions]
     *      description: viewing other's profile
     *      parameters:
     *          -   in: header
     *              name: Auth
     *              required: true
     *              type: string
     *              description: token to authenticate user to the resources
     *      responses:
     *          '200':
     *              description: Successful
     *          '401':
     *              description: Unauthorized
     *          '500':
     *              description: uknown server error
     */ 

    router.get('/transactions',validateToken,transaction.retrieveAll)

    router.patch('/rates',validateToken,isAdmin,rateValidate,rate.update)

    // redeeming the profit
    router.get('/rates',validateToken,rate.findOne)
    router.get('/redeem',validateToken,redeemValidate,redeem)



export default router