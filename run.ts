// async function main() {

// }

// main()

import { Field, PrivateKey, PublicKey, Mina, Party, Signature } from 'snarkyjs';
import { Reed } from './Reed'
const prompt = require('cli-prompt');
// oracle with random

export function createLocalBlockchain(): PrivateKey[] {
  let Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);
  return [Local.testAccounts[0].privateKey, Local.testAccounts[1].privateKey];
}

// 

const [player1, player2] = createLocalBlockchain();
const player1Public = player1.toPublicKey();
const player2Public = player2.toPublicKey();

const zkAppPrivkey = PrivateKey.random();
const zkAppPubkey = zkAppPrivkey.toPublicKey();
const zkAppInstance = new Reed(zkAppPubkey);
 

prompt('enter your first name: ', function (val: any) {
  var first = val;
  prompt('and your last name: ', function (val: any) {
    console.log('hi, ' + first + ' ' + val + '!');
  }, function (err: any) {
    console.error('unable to read last name: ' + err);
  });
}, function (err: any) {
  console.error('unable to read first name: ' + err);
});
