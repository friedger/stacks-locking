import { PooledStackerFormValues } from 'src/types/stacking';

export interface DelegateStackExtendFormValues extends PooledStackerFormValues {
  /**
   * The PoX rewards address. The address where rewards are paid into,
   * https://github.com/stacks-network/stacks-blockchain/blob/cc3eb0f5011f63ae00cf2afc7a32a32c830fb1c6/src/chainstate/stacks/boot/pox-2.clar#L584.
   *
   * Must be of a supported address type
   */
  poxAddress: string;

  /**
   * The number of cycles to further lock up the funds for,
   * https://github.com/stacks-network/stacks-blockchain/blob/feat/2.1.0.0.0/src/chainstate/stacks/boot/pox-2.clar#L818
   */
  extendCount: number;
}
