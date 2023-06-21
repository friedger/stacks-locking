import { PooledStackerFormValues } from 'src/types/stacking';

export interface DelegateStackIncreaseFormValues extends PooledStackerFormValues {
  /**
   * Pool member who delegated
   * https://github.com/stacks-network/stacks-blockchain/blob/2.1.0.0.0/src/chainstate/stacks/boot/pox-2.clar#L814
   */
  stacker: string;

  /**
   * Amount of STX to lock for the stacker. Note that this amount is expressed in STX, while the PoX contract uses uSTX.
   * Must be less or equal than the delegated amount and the stacker's balance.
   * Must be more than the currently stacked amount.
   * The contract accepts an increaseBy value that needs to calculated using the locked balance.
   * https://github.com/stacks-network/stacks-blockchain/blob/2.1.0.0.0/src/chainstate/stacks/boot/pox-2.clar#L815
   */
  amount: string;

  /**
   * The PoX rewards address. The address where rewards are paid into,
   * https://github.com/stacks-network/stacks-blockchain/blob/cc3eb0f5011f63ae00cf2afc7a32a32c830fb1c6/src/chainstate/stacks/boot/pox-2.clar#L584.
   *
   * Must be of a supported address type
   */
  poxAddress: string;
}
