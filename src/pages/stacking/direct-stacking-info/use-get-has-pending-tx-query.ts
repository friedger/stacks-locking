import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@components/auth-provider/auth-provider';
import { useBlockchainApiClient } from '@components/blockchain-api-client-provider';
import { useStackingClient } from '@components/stacking-client-provider/stacking-client-provider';
import { useStacksNetwork } from '@hooks/use-stacks-network';

import { getHasPendingDirectStacking } from './get-has-pending-direct-stacking';
import { getHasPendingStackExtend } from './get-has-pending-stack-extend';
import { getHasPendingStackIncrease } from './get-has-pending-stack-increase';

export function useGetHasPendingStackingTransactionQuery() {
  const { accountsApi, transactionsApi } = useBlockchainApiClient();
  const { client } = useStackingClient();
  const { address } = useAuth();
  const { networkName } = useStacksNetwork();
  if (!client) {
    // TODO: report error
    throw new Error('Expected to have a StackingClient available in the context.');
  }

  if (!address) {
    // TODO: report error
    throw new Error('Expected `address` to be defined.');
  }

  const getHasPendingDirectStackingQuery = useQuery(
    ['pending-stacking-status', client, accountsApi, address, transactionsApi, networkName],
    async () =>
      getHasPendingDirectStacking({
        stackingClient: client,
        accountsApi,
        address,
        transactionsApi,

        // TODO: better types or type checks to ensure all network names work
        network: networkName as 'mainnet' | 'testnet',
      }),
    { refetchInterval: 5000 }
  );
  const getHasPendingStackIncreaseQuery = useQuery(
    ['pending-stack-increase', client, accountsApi, address, transactionsApi, networkName],
    async () =>
      getHasPendingStackIncrease({
        stackingClient: client,
        accountsApi,
        address,
        transactionsApi,
      }),
    { refetchInterval: 5000 }
  );
  const getHasPendingStackExtendQuery = useQuery(
    ['pending-stack-extend', client, accountsApi, address, transactionsApi, networkName],
    async () =>
      getHasPendingStackExtend({
        stackingClient: client,
        accountsApi,
        address,
        transactionsApi,
        network: networkName,
      }),
    { refetchInterval: 5000 }
  );
  return {
    getHasPendingDirectStackingQuery,
    getHasPendingStackIncreaseQuery,
    getHasPendingStackExtendQuery,
  };
}
