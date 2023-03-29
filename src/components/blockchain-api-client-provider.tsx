import { ReactNode, createContext, useContext } from 'react';

import {
  AccountsApi,
  BlocksApi,
  Configuration,
  FaucetsApi,
  FeesApi,
  FungibleTokensApi,
  InfoApi,
  MicroblocksApi,
  NamesApi,
  NonFungibleTokensApi,
  RosettaApi,
  SearchApi,
  SmartContractsApi,
  StackingRewardsApi,
  TransactionsApi,
} from '@stacks/blockchain-api-client';

import { useNetwork } from './network-provider';

const Context = createContext<{
  accountsApi: AccountsApi;
  blocksApi: BlocksApi;
  faucetsApi: FaucetsApi;
  feesApi: FeesApi;
  fungibleTokensApi: FungibleTokensApi;
  infoApi: InfoApi;
  microblocksApi: MicroblocksApi;
  namesApi: NamesApi;
  nonFungibleTokensApi: NonFungibleTokensApi;
  rosettaApi: RosettaApi;
  searchApi: SearchApi;
  smartContractsApi: SmartContractsApi;
  stackingRewardsApi: StackingRewardsApi;
  transactionsApi: TransactionsApi;

  // The context type is non-null to avoid null checks wherever the context is used.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
}>(null!);

interface Props {
  children: ReactNode;
}
export function BlockchainApiClientProvider({ children }: Props) {
  const { network } = useNetwork();
  const config = new Configuration({ basePath: network.coreApiUrl });

  return (
    <Context.Provider
      value={{
        accountsApi: new AccountsApi(config),
        blocksApi: new BlocksApi(config),
        faucetsApi: new FaucetsApi(config),
        feesApi: new FeesApi(config),
        fungibleTokensApi: new FungibleTokensApi(config),
        infoApi: new InfoApi(config),
        microblocksApi: new MicroblocksApi(config),
        namesApi: new NamesApi(config),
        nonFungibleTokensApi: new NonFungibleTokensApi(config),
        rosettaApi: new RosettaApi(config),
        searchApi: new SearchApi(config),
        smartContractsApi: new SmartContractsApi(config),
        stackingRewardsApi: new StackingRewardsApi(config),
        transactionsApi: new TransactionsApi(config),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useBlockchainApiClient() {
  return useContext(Context);
}
