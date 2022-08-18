import {
  Field,
  State,
  PublicKey,
  SmartContract,
  state,
  method,
  Bool,
  Circuit,
  Signature,
  Permissions,
  DeployArgs,
} from 'snarkyjs';

// conserve future energy with present energy bitfield translation, test with fool
const tarot = [
  ['x','o','o','o','o','o','o','o','o','o','o','o','x','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o']
]

/*
  1-4
    - elements - +1 fire, -1 water, +2 air, -2 earth
  1-10
    - planets - 1-5-10 -> -5-+5
  1-12 = 
    - zodiac - compatibility chart: +0 match, +1 favourable, -1 not favourable
  1-3 = 1x, 2x, 3x, rate (?)
    -north node
    -star of david
    -pentagram
*/

// loop on element, if el == x, then el.assertEquals().add(sum)

// [,,,]

// TODO: apply matrix multiplication against prime frequencies.
// const primes = [
//   '',
// ]

export class Reed extends SmartContract {
	@state(Field) spread = State<Field>();

  constructor(pbKey: any){
    this.super(pbKey)
  }

	@method pull(){
    console.log('testing')
	}
	// get card, loop on index of list of elements, compute dot product to running sum
	// make sure to do indexed pulls on, what does this mean?
}
