export enum PoolName {
  FastPool = "FAST Pool",
  Xverse = "Xverse",
  PlanBetter = "Plan Better",
  CustomPool = "Custom Pool",
}
export enum PoxContract {
  pox2 = "ST000000000000000000002AMW42H.pox-2",
  poxDelegation = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.pox-delegation",
  fpDelegation = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.fp-delegation",
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
