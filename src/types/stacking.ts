import { DelegationInfo, StackerInfo } from '@stacks/stacking';

export type StackerInfoDetails = (StackerInfo & { stacked: true })['details'];
export type DelegationInfoDetails = (DelegationInfo & { delegated: true })['details'];

export interface PooledStackerFormValues {
  /**
   * Pool member who delegated
   */
  stacker: string;
  totalAmount: bigint | undefined;
  lockedAmount: bigint | undefined;
  unlockHeight: bigint | undefined;
  delegated: boolean | undefined;
  delegatedAmount: bigint | undefined;
  delegatedTo: string | undefined;
}
