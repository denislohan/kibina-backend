import models from '../src/database/models'
const {profile} = models;



export default (server,chaiHttp,chai,expect) => {
    let authUser =
        {"username":"admin",
        "password": "eaty6t1jkjka"
    },
    fakeAuthUser = {
        "username":"admin",
        "password": "eaty6t1jkjka5"
    },
    invaliduser = {
        "user":"admin",
        "password": "eaty6t1jkjka5"
    }
        
    describe('Integration test Controller: Auth',()=>{
        it('++: login should work with real credentials', async () => {
            const result = await chai
            .request(server)
            .post('/api/login')
            .send(authUser);
            //currentToken = result.body.data.token;
            result.should.have.status(201);
            result.body.should.be.an('object');
        });

        it('--: login should fail on fake passkey/username', async () => {
            const result = await chai
            .request(server)
            .post('/api/login')
            .send(fakeAuthUser);
            result.body.should.be.an('object');
            expect(result.body.status).to.equal(401)

        });

        it('--: login should fail on invalid inputs', async () => {
            const result = await chai
            .request(server)
            .post('/api/login')
            .send({invaliduser});
                    expect(result.body.status).to.equal(400)
        });
        
        
        /**
         * Signup
        */

        it('++: Signup should work with real data', async () => {
            const result = await chai
            .request(server)
            .post('/api/signup')
            .send({
                    username: "denis",
                    password: "mwanaumw76",
                    familyName:"Lohan",
                    firstName: "denis"
                });
            //currentToken = result.body.data.token;
            result.should.have.status(201);
            result.body.should.be.an('object');
        });

        it('--: Signup should fail on a used username', async () => {
            const result = await chai
            .request(server)
            .post('/api/signup')
            .send({
                username: "admin",
                password: "mwanaumw76",
                familyName:"Lohan",
                firstName: "denis"
                });
                result.should.have.status(409); //conflict

        });

        it('--: signup should fail on invalid inputs', async () => {
            const result = await chai
            .request(server)
            .post('/api/signup')
            .send({"email":"oli-moz@kibina.com",
                    });
            expect(result.body.status).to.equal(400)
        });
        

    })

}