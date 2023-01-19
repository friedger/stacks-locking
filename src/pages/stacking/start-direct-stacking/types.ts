export interface DirectStackingFormValues {
  /**
   * The amount of STX to lock up. Note that this amount is expressed in STX, while the PoX contract uses uSTX,
   * https://github.com/stacks-network/stacks-blockchain/blob/cc3eb0f5011f63ae00cf2afc7a32a32c830fb1c6/src/chainstate/stacks/boot/pox-2.clar#L583.
   * The amount is later converted from STX to uSTX during the form submission.
   */
  amountStx: string;

  /**
   * The PoX rewards address. The address where rewards are paid into,
   * https://github.com/stacks-network/stacks-blockchain/blob/cc3eb0f5011f63ae00cf2afc7a32a32c830fb1c6/src/chainstate/stacks/boot/pox-2.clar#L584.
   *
   * Must be of a supported address type,
   * https://github.com/stacks-network/stacks-blockchain/blob/cc3eb0f5011f63ae00cf2afc7a32a32c830fb1c6/src/chainstate/stacks/boot/pox-mainnet.clar#L14-L17.
   */
  poxAddress: string;

  /**
   * The number of cycles to lock up the funds for,
   * https://github.com/stacks-network/stacks-blockchain/blob/feat/2.1.0.0.0-rc2/src/chainstate/stacks/boot/pox-2.clar#L586.
   */
  lockPeriod: number;
}
