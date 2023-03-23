export enum PoolName {
  FastPool = 'FAST Pool',
  Xverse = 'Xverse',
  PlanBetter = 'Plan Better',
  CustomPool = 'Custom Pool',
}
export enum Pox2Contract {
  PoX2 = 'ST000000000000000000002AMW42H.pox-2',
  WrapperOncCycle = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.pox-pools-1-cycle',
  WrapperFastPool = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.pox-pool-self-service',
}
export enum PayoutMethod {
  BTC = 'BTC',
  STX = 'STX',
  OTHER = 'OTHER',
}

export type Pool = {
  name: PoolName;
  poolAddress: string | undefined;
  description: string;
  website: string;
  duration: number;
  icon: JSX.Element;
  payoutMethod: PayoutMethod;
  poxContract: Pox2Contract;
  allowCustomRewardAddress: boolean;
};

export function usesPoxWrapperContract(pool: Pool) {
  return pool.poxContract !== Pox2Contract.PoX2;
}
