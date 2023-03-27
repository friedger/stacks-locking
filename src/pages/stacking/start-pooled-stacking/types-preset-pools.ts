import { initialNetworkName } from '@components/network-provider';

export enum PoolName {
  FastPool = 'FAST Pool',
  Xverse = 'Xverse',
  PlanBetter = 'Plan Better',
  CustomPool = 'Custom Pool',
}
enum Pox2ContractDevnet {
  PoX2 = 'ST000000000000000000002AMW42H.pox-2',
  WrapperOneCycle = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.pox-pools-1-cycle',
  WrapperFastPool = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.pox-pool-self-service',
}
enum Pox2ContractTestnet {
  PoX2 = 'ST000000000000000000002AMW42H.pox-2',
  WrapperOneCycle = 'ST2PABAF9FTAJYNFZH93XENAJ8FVY99RRM4DF2YCW.pox-pools-1-cycle',
  WrapperFastPool = 'ST2PABAF9FTAJYNFZH93XENAJ8FVY99RRM4DF2YCW.pox-pool-self-service',
}
enum Pox2ContractMainnet {
  PoX2 = 'SP000000000000000000002Q6VF78.pox-2',
  WrapperOneCycle = 'SP001SFSMC2ZY76PD4M68P3WGX154XCH7NE3TYMX.pox-pools-1-cycle',
  WrapperFastPool = 'SP21YTSM60CAY6D011EZVEVNKXVW8FVZE198XEFFP.pox-pool-self-service',
}

export const Pox2Contract = initialNetworkName === 'testnet' ? Pox2ContractTestnet : Pox2ContractMainnet;

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
