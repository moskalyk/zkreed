import { Add } from './Add';
import {
  isReady,
  shutdown,
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  Party,
} from 'snarkyjs';

/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

function createLocalBlockchain() {
  const Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);
  return Local.testAccounts[0].privateKey;
}

async function localDeploy(
  zkAppInstance: Add,
  zkAppPrivkey: PrivateKey,
  deployerAccount: PrivateKey
) {
  const txn = await Mina.transaction(deployerAccount, () => {
    Party.fundNewAccount(deployerAccount);
    zkAppInstance.deploy({ zkappKey: zkAppPrivkey });
    zkAppInstance.init();
  });
  await txn.send().wait();
}

describe('Add', () => {
  let deployerAccount: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey;

  beforeEach(async () => {
    await isReady;
    deployerAccount = createLocalBlockchain();
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
  });

  afterAll(async () => {
    // `shutdown()` internally calls `process.exit()` which will exit the running Jest process early.
    // Specifying a timeout of 0 is a workaround to defer `shutdown()` until Jest is done running all tests.
    // This should be fixed with https://github.com/MinaProtocol/mina/issues/10943
    setTimeout(shutdown, 0);
  });

  it('generates and deploys the `Add` smart contract', async () => {
    const zkAppInstance = new Add(zkAppAddress);
    await localDeploy(zkAppInstance, zkAppPrivateKey, deployerAccount);
    const num = zkAppInstance.num.get();
    expect(num).toEqual(Field.one);
  });

  it('correctly updates the num state on the `Add` smart contract', async () => {
    const zkAppInstance = new Add(zkAppAddress);
    await localDeploy(zkAppInstance, zkAppPrivateKey, deployerAccount);

    const tarot = [
      // fool
      [
        'x',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'x',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
      ],
      // strength
      [
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'x',
        'o',
        'o',
        'o',
        'o',
        'o',
        'x',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
      ],

      // judgement
      [
        'o',
        'x',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'x',
        'x',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
      ],

      // hanged man
      [
        'o',
        'x',
        'x',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'x',
        'o',
        'o',
        'x',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
      ],

      // 9 of wands
      // []
    ];

    for (let j = 0; j < tarot.length; j++) {
      let sum = 0;

      for (let i = 0; i < tarot[1].length; i++) {
        if (tarot[j][i] == 'x') {
          // console.log(i)
          if (i < 4) {
            // console.log('elements')
            const elements = {
              0: 2,
              1: 1,
              2: -1,
              3: -2,
            };
            // sum+=i
            // console.log(elements[i as keyof typeof elements])
            sum += elements[i as keyof typeof elements];
          } else if (i >= 4 && i < 14) {
            // incrememnt between -5 -> +5
            const index = i - 4 - 5;
            // console.log('planets', index)
            sum += index;
            // console.log(index)
          } else if (i >= 14 && i < 17) {
            // multiply by 1, 2, 3
            const index = i - 14;
            // console.log('nodes')
            if (i == 1) sum *= 2;
            else if (i == 2) sum = -1 * sum;
            else if (i == 3) sum /= index;
            // console.log(index)
            // i = i * index
          } else if (i >= 17 && i < 29) {
            // increment by 1 - 12
            const index = i - 17;
            // console.log(index)
            sum += index;

            // console.log('houses')
          }
        }
      }
      console.log(`sum: ${sum}`);

      (
        await Mina.transaction(deployerAccount, () => {
          zkAppInstance.update(Field(sum));
          zkAppInstance.sign(zkAppPrivateKey);
        })
      )
        .send()
        .wait();
    }

    // }

    // (
    //   await Mina.transaction(deployerAccount, () => {
    //       zkAppInstance.update(Field(2));
    //       zkAppInstance.sign(zkAppPrivateKey);
    //     }
    //   )
    // ).send().wait();
    // await txn.send().wait();

    // const txn = await Mina.transaction(deployerAccount, () => {
    //   zkAppInstance.update(Field(2));
    //   zkAppInstance.sign(zkAppPrivateKey);
    // });
    // await txn.send().wait();

    const updatedNum = zkAppInstance.num.get();
    expect(updatedNum).toEqual(Field(9));
  });
});
