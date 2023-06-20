import { DelegationInfo, StackerInfo } from '@stacks/stacking';

export type StackerInfoDetails = (StackerInfo & { stacked: true })['details'];
export type DelegationInfoDetails = (DelegationInfo & { delegated: true })['details'];
