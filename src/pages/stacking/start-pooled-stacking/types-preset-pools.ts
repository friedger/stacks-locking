export enum PoolName {
  FastPool = "FAST Pool",
  Xverse = "Xverse",
  PlanBetter = "Plan Better",
  CustomPool = "Custom Pool",
}
export enum PoxContract {
  pox2 = "ST000.pox-2",
  poxDelegation = "ST1234.pox-delegation",
  fpDelegation = "STABC.fp-delegation",
}
export enum PayoutMethod {
  BTC = "BTC",
  STX = "STX",
}

export type Pool = {
  name: PoolName;
  poolAddress: string;
  description: string;
  website: string;
  duration: number;
  icon: JSX.Element;
  payoutMethod: PayoutMethod;
  poxContract: PoxContract;
  allowCustomRewardAddress: boolean;
};
