import { useAuth } from '@components/auth-provider/auth-provider';
import { useBlockchainApiClient } from '@components/blockchain-api-client-provider';
import { useStackingClient } from '@components/stacking-client-provider/stacking-client-provider';
import { useQuery } from '@tanstack/react-query';
import { getHasPendingDirectStacking } from './get-has-pending-direct-stacking';

export function useGetHasPendingDirectStackingQuery() {
  const { accountsApi, transactionsApi } = useBlockchainApiClient();
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
      getHasPendingDirectStacking({
        stackingClient: client,
        accountsApi,
        address,
        transactionsApi,
      }),
    { refetchInterval: 2000 }
  );
}
