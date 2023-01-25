import { useAuth } from '@components/auth-provider/auth-provider';
import { useBlockchainApiClient } from '@components/blockchain-api-client-provider';
import { useStackingClient } from '@components/stacking-client-provider/stacking-client-provider';
import { useQuery } from '@tanstack/react-query';
import { getDelegationStatus } from './get-delegation-status';

export function useDelegationStatusQuery() {
  const { accountsApi, smartContractsApi, transactionsApi } = useBlockchainApiClient();
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
    { refetchInterval: 5000 }
  );
}
