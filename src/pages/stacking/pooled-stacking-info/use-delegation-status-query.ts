import { useAuth } from '@components/auth-provider/auth-provider';
import { useStackingClient } from '@components/stacking-client-provider/stacking-client-provider';
import { NETWORK } from '@constants/index';
import {
  SmartContractsApi,
  Configuration,
  AccountsApi,
  TransactionsApi,
} from '@stacks/blockchain-api-client';
import { useQuery } from '@tanstack/react-query';
import { getDelegationStatus } from './get-delegation-status';

// NOTE: the package `@stacks/stacking` does not yet provide a way to read the
// PoX contract's delegation map. Therefore, this data must be fetched by other
// means. In this case, using `@stacks/blockchain-api-client`.
const basePath =
  NETWORK === 'testnet'
    ? 'https://stacks-node-api.testnet.stacks.co'
    : 'https://stacks-node-api.mainnet.stacks.co';
const config = new Configuration({ basePath });
const smartContractsApi = new SmartContractsApi(config);
const accountsApi = new AccountsApi(config);
const transactionsApi = new TransactionsApi(config);

export function useDelegationStatusQuery() {
  const { client } = useStackingClient();
  const { address } = useAuth();
  if (!client) {
    // TODO: report error
    throw new Error('Expected to have a StackingClient available in the context.');
  }

  if (!address) {
    // TODO: report error
    throw new Error('Expected `address` to be defined.');
  }

  return useQuery(
    ['delegation-status'],
    async () =>
      getDelegationStatus({
        stackingClient: client,
        accountsApi,
        address,
        smartContractsApi,
        transactionsApi,
      }),
    { refetchInterval: 2000 }
  );
}
