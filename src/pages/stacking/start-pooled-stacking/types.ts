interface DelegatingFormIndefiniteValues<N> {
  delegationDurationType: 'indefinite';
  amountStx: N;
  poolAddress: string;
}
interface DelegatingFormLimitedValues<N> {
  delegationDurationType: 'limited';
  amountStx: N;
  poolAddress: string;
  numberOfCycles: number;
}
type AbstractDelegatingFormValues<N> =
  | DelegatingFormIndefiniteValues<N>
  | DelegatingFormLimitedValues<N>;

export type EditingFormValues = AbstractDelegatingFormValues<string | number>;
