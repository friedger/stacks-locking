export const enum NetworkInstance {
  mainnet = 'mainnet',
  testnet = 'testnet',
  devnet = 'devnet',
}

export const enum PoolName {
  FastPool = 'FAST Pool',
  Xverse = 'Xverse',
  PlanBetter = 'PlanBetter',
  CustomPool = 'Custom Pool',
}

export const enum PoxContractName {
  Pox3,
  WrapperOneCycle,
  WrapperFastPool,
}

export const NetworkInstanceToPoxContractMap = {
  [NetworkInstance.devnet]: {
    [PoxContractName.Pox3]: 'ST000000000000000000002AMW42H.pox-3',
    [PoxContractName.WrapperOneCycle]:
      'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.pox-pools-1-cycle',
    [PoxContractName.WrapperFastPool]:
      'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.pox-pool-self-service',
  },
  [NetworkInstance.testnet]: {
    [PoxContractName.Pox3]: 'ST000000000000000000002AMW42H.pox-3',
    [PoxContractName.WrapperOneCycle]:
      'ST2PABAF9FTAJYNFZH93XENAJ8FVY99RRM4DF2YCW.pox-pools-1-cycle-v2',
    [PoxContractName.WrapperFastPool]:
      'ST2PABAF9FTAJYNFZH93XENAJ8FVY99RRM4DF2YCW.pox-pool-self-service-v2',
  },
  [NetworkInstance.mainnet]: {
    [PoxContractName.Pox3]: 'SP000000000000000000002Q6VF78.pox-3',
    [PoxContractName.WrapperOneCycle]: 'SP001SFSMC2ZY76PD4M68P3WGX154XCH7NE3TYMX.pox-pools-1-cycle-v2',
    [PoxContractName.WrapperFastPool]: 'SP21YTSM60CAY6D011EZVEVNKXVW8FVZE198XEFFP.pox-fast-pool-v2',
  },
} as const;

export const enum PayoutMethod {
  BTC = 'BTC',
  STX = 'STX',
  OTHER = 'OTHER',
}
type ContractMapType = typeof NetworkInstanceToPoxContractMap;
export type PoxContractType = ContractMapType[NetworkInstance];

export type WrapperPrincipal = PoxContractType[keyof PoxContractType][PoxContractName];

export type Pool = {
  name: PoolName;
  poolAddress: { [key in NetworkInstance]: string } | undefined;
  description: string;
  website: string;
  duration: number;
  icon: JSX.Element;
  payoutMethod: PayoutMethod;
  poxContract: PoxContractName;
  minimumDelegationAmount: number;
  allowCustomRewardAddress: boolean;
};
