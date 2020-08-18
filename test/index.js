import server from '../src'
import chai,{expect} from 'chai'
import chaiHttp from 'chai-http';


chai.use(chaiHttp);
chai.should();
describe('Integration test Controller test',()=>{

    it('The service should be on', async () => {
        const result = await chai
          .request(server)
          .get('/api/test')
          .send({});
        //currentToken = result.body.data.token;
        result.should.have.status(200);
        result.body.should.be.an('object');
        result.body.status.should.be.an('string');
        expect(result.body.status).to.equal('Service is On')

      });

})