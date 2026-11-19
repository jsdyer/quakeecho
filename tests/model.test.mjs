import assert from 'node:assert/strict';
import test from 'node:test';
import {communities} from '../web/model.mjs';
test('minimum sample and place filters preserve distinct source areas',()=>{
 const rows=[{area:'Sechelt',city:'Sechelt',reports:7,intensity:4,distance:22},{area:'99999',city:'Sechelt',reports:1,intensity:7,distance:8}];
 assert.equal(communities(rows,'SECHELT',2,'intensity').length,1);
 assert.equal(communities(rows,'',1,'distance')[0].area,'99999');
 assert.equal(communities(rows,'other',1,'reports').length,0);
});
