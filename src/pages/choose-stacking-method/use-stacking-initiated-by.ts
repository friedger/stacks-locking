import { useAuth } from '@components/auth-provider/auth-provider';
import { useBlockchainApiClient } from '@components/blockchain-api-client-provider';
import {
  useGetAccountExtendedBalancesQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';
import { useQuery } from '@tanstack/react-query';

/**
 * Returns the address that initiated the current account's stacking. If the account isn't stacking,
 * returns `null`.
 */
export function useStackingInitiatedByQuery() {
  const { transactionsApi } = useBlockchainApiClient();
  const { address } = useAuth();

  if (!address) {
    // TODO: report error
    throw new Error('Expected `address` to be defined.');
  }

  const q = useGetAccountExtendedBalancesQuery();

  const txId = (q.data?.stx as any)?.lock_tx_id as string | undefined;

  return useQuery(
    ['stacker', txId, address, transactionsApi],
    async () => {
      if (!txId) return { address: null } as const;
      const res = await transactionsApi.getTransactionById({
        txId,
      });
      return { address: (res as any).sender_address as string };
    },
    { enabled: !q.isLoading }
  );
}
