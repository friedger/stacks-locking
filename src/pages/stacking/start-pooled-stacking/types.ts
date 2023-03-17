interface DelegatingFormIndefiniteValues<N> {
  delegationDurationType: 'indefinite';
  amount: N;
  poolAddress: string;
  rewardAddress: string;
  presetPool: PresetPool | undefined;
}
interface DelegatingFormLimitedValues<N> {
  delegationDurationType: 'limited';
  amount: N;
  poolAddress: string;
  numberOfCycles: number;
  rewardAddress: string;
  presetPool: PresetPool | undefined;
}
type AbstractDelegatingFormValues<N> =
  | DelegatingFormIndefiniteValues<N>
  | DelegatingFormLimitedValues<N>;

export type EditingFormValues = AbstractDelegatingFormValues<string | number>;

export type PresetPool = {
  logoUrl: string;
  poolAddress: string;
  description: string;
  website: string;
  duration: number;
  payoutMethod: "BTC" | "STX";
};
