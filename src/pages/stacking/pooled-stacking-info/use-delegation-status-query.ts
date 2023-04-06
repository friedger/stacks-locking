import { StackingClient } from '@stacks/stacking';
import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@components/auth-provider/auth-provider';
import { useBlockchainApiClient } from '@components/blockchain-api-client-provider';
import { useStackingClient } from '@components/stacking-client-provider/stacking-client-provider';

import { getDelegationStatus } from './get-delegation-status';

export function useDelegationStatusQuery() {
  const { client } = useStackingClient();
  const { address } = useAuth();
  return useDelegationStatusForUserQuery({ client, address });
}
interface UseDelegationStatusForUserQueryArgs {
  client: StackingClient | null;
  address: string | null;
}
export function useDelegationStatusForUserQuery({
  client,
  address,
}: UseDelegationStatusForUserQueryArgs) {
  const { accountsApi, smartContractsApi, transactionsApi } = useBlockchainApiClient();
  if (!client) {
    // TODO: report error
    throw new Error('Expected to have a StackingClient available in the context.');
  }

  if (!address) {
    // TODO: report error
    throw new Error('Expected `address` to be defined.');
  }

  return useQuery(
    ['delegation-status', client, accountsApi, address, smartContractsApi, transactionsApi],
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
