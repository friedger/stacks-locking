import { useAuth } from '@components/auth-provider/auth-provider';
import { useBlockchainApiClient } from '@components/blockchain-api-client-provider';
import {
  useGetAccountExtendedBalancesQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';
import { useQuery } from '@tanstack/react-query';
import { useDelegationStatusQuery } from './use-delegation-status-query';

/**
 * Fetches the address of the delegator the currently active account has delegated to or is stacking with if any.
 */
export function useGetPoolAddress() {
  // The pool address is fetched from two locations as there is no one place where this information
  // is always available.
  //
  // - When the user is delegating, the pool's address can be fetched from the delegation state map.
  // - When the pool is stacking the user's funds, the pool's address can be fetched from the
  //   transaction data that initiated stacking.
  //
  // This means that after a user has delegated to a pool, but before the pool has started stacking,
  // the pool's address can only be fetched from the delegation state map. If the user is both
  // delegating and stacking, the pool address will be available in both locations. However, if the
  // user is still stacking and they have revoked the delegation, the pool address can only be
  // obtained from the stacking transaction data.
  //
  // Regardless of which at which point in the pooling lifecycle the user is in, this data should
  // always be available from at least one source.

  const { client } = useStackingClient();
  const { address } = useAuth();
  const { transactionsApi } = useBlockchainApiClient();
  if (!client) {
    // TODO: report error
    throw new Error('Expected to have a StackingClient available in the context.');
  }

  if (!address) {
    // TODO: report error
    throw new Error('Expected `address` to be defined.');
  }

  const q = useGetAccountExtendedBalancesQuery();
  const q2 = useDelegationStatusQuery();

  const txId = (q.data?.stx as any)?.lock_tx_id as string | undefined;

  return useQuery(
    ['stacker', { txId, address: q2.data?.delegatedTo }] as const,
    async ({ queryKey }) => {
      const { txId, address } = queryKey[1];
      if (address) {
        return { address };
      }
      if (!txId) {
        return { address: null };
      }
      const res = await transactionsApi.getTransactionById({
        txId,
      });
      return { address: (res as any).sender_address as string };
    },
    { enabled: !q.isLoading && !q2.isLoading }
  );
}
