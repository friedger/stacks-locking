export interface StackAggregationCommitFormValues {
  /**
   * The PoX rewards address. The address where rewards are paid into,
   * https://github.com/stacks-network/stacks-blockchain/blob/cc3eb0f5011f63ae00cf2afc7a32a32c830fb1c6/src/chainstate/stacks/boot/pox-2.clar#L734   *
   * Must be of a supported address type
   */
  poxAddress: string;

  /**
   * The reward cycle id that should be finalized.
   * https://github.com/stacks-network/stacks-blockchain/blob/cc3eb0f5011f63ae00cf2afc7a32a32c830fb1c6/src/chainstate/stacks/boot/pox-2.clar#L735
   */
  rewardCycleId: number;
}
