import {
  Field,
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
} from 'snarkyjs';

/**
 * Basic Example
 * See https://docs.minaprotocol.com/zkapps for more info.
 *
 * The Add contract initializes the state variable 'num' to be a Field(1) value by default when deployed.
 * When the 'update' method is called, the Add contract adds Field(2) to its 'num' contract state.
 *
 * This file is safe to delete and replace with your own contract.
 */
export class Add extends SmartContract {
  @state(Field) num = State<Field>();

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
  }

  @method init() {
    this.num.set(Field(0));
  }

  @method update(num: Field) {
    const currentState = this.num.get();
    this.num.assertEquals(currentState); // precondition that links this.num.get() to the actual on-chain state
    // if(num < 0) {
    // catch if false
    const newState = currentState.add(num);
    this.num.set(newState);
    // const newState = currentState.sub(num);
    // newState.assertEquals(currentState.add(num));
    // this.num.set(newState);
    // } else {
    // const newState = currentState.add(num);
    // newState.assertEquals(currentState.add(num));
    // this.num.set(newState);
    // }
  }
}