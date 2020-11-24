import server from '../src'
import chai,{expect} from 'chai'
import chaiHttp from 'chai-http';
import testAuthEndpoints from './auth'
import testRateEndpoint from './rate'
import testPaymentEndpoint from './rate'
import testAccountEndpoint from './rate'
import testRedeemEndpoint from './rate'
import testTransactionEndpoint from './rate'





chai.use(chaiHttp);
chai.should();
testAuthEndpoints(server,chaiHttp,chai,expect);
testRateEndpoint(server,chaiHttp,chai,expect);
// testPaymentEndpoint(server,chaiHttp,chai,expect);
// testAccountEndpoint(server,chaiHttp,chai,expect);
// testRateEndpoint(server,chaiHttp,chai,expect);





