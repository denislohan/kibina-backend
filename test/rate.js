export default (server,chaiHttp,chai,expect) => {
    let admin =
        {
            "username":"admin",
            "password": "eaty6t1jkjka"
        },
        agent = 
        {
            "username":"agent",
            "password": "eaty6t1jkjka"
        }
        
    describe("Rates Test Suite",()=>{
        it('--: Setting Rates should fail on no auth',async()=>{
            const result =  await chai
                .request(server)
                .patch('/api/rates')
                .send({
                    "currency": 14,
                    "companyFees": 8,
                    "agentFees": 2,
                    "profitToRedeem": 10000
                })
                result.body.error.should.be.an('object');
                expect(result.body.error.status).to.equal(401) //unauthorized
        })

        it('++: Setting Rates should work on fine auth',async()=>{
            const result =  await chai
                .request(server)
                .post('/api/login')
                .send(admin)
                    .then( async (res) =>{
                        const result =  await chai
                        .request(server)
                        .patch('/api/rates')
                        .set("auth", "Bearer " + res.body.token) //set the header first
                        .send({
                            "currency": 14,
                            "companyFees": 8,
                            "agentFees": 2,
                            "profitToRedeem": 10000
                        })
                        result.body.should.be.an('object');
                        expect(result.body.status).to.equal(200) //updates succesfully
                    })
                           
        })
        it('++: Getting Rates should work on fine auth',async()=>{
            const result =  await chai
                .request(server)
                .post('/api/login')
                .send(agent)
                    .then( async (res) =>{
                        const result =  await chai
                        .request(server)
                        .patch('/api/rates')
                        .set("auth", "Bearer " + res.body.token) //set the header first
                        .send({
                            "currency": 14,
                            "companyFees": 8,
                            "agentFees": 2,
                            "profitToRedeem": 10000
                        })
                            .then(async ()=>{
                                    const result =  await chai
                                    .request(server)
                                    .get('/api/rates')
                                    .set("auth", "Bearer " + res.body.token) //set the header first
                                    .send()
                                    result.body.should.be.an('object');
                                    expect(result.body.status).to.equal(200) // rates retrieved
                                    expect(result.body.data.currency).to.equal(14) // rates retrieved
                            })
                      
                    })
                           
        })

        it('--: Setting Rates should fail on wrong access level',async()=>{
            const result =  await chai
                .request(server)
                .post('/api/login')
                .send(agent)
                    .then( async (res) =>{
                        const result =  await chai
                        .request(server)
                        .patch('/api/rates')
                        .set("auth", "Bearer " + res.body.token) //set the header first
                        .send({
                            "currency": 14,
                            "companyFees": 8,
                            "agentFees": 2,
                            "profitToRedeem": 10000
                        })
                        expect(result.status).to.equal(403) //Forbiden access
                    })
                           
        })



    })

}
