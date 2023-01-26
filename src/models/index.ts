// TODO: is this still necessary?
declare global {
  const CONFIG: {
    NODE_ENV: 'development' | 'production' | 'test';
    DEBUG_PROD: string;
    STX_NETWORK: 'testnet' | 'mainnet';
    PLAIN_HMR?: string;
    START_HOT: boolean;
    PORT?: number;
    PULL_REQUEST?: string;
    BRANCH_NAME?: string;
    SHA?: string;
  };
}

export {};
