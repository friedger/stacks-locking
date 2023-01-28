interface DelegatingFormIndefiniteValues<N> {
  delegationDurationType: "indefinite";
  amount: N;
  poolAddress: string;
}
interface DelegatingFormLimitedValues<N> {
  delegationDurationType: "limited";
  amount: N;
  poolAddress: string;
  numberOfCycles: number;
}
type AbstractDelegatingFormValues<N> =
  | DelegatingFormIndefiniteValues<N>
  | DelegatingFormLimitedValues<N>;

export type EditingFormValues = AbstractDelegatingFormValues<string | number>;
