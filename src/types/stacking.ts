import { StackerInfo } from '@stacks/stacking';

export type StackerInfoDetails = (StackerInfo & { stacked: true })['details'];
