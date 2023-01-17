import { useAuth } from '@components/auth-provider/auth-provider';
import {
  useGetAccountExtendedBalancesQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';
import { NETWORK } from '@constants/index';
import { Configuration, TransactionsApi } from '@stacks/blockchain-api-client';
import { useQuery } from '@tanstack/react-query';

// NOTE: the package `@stacks/stacking` does not yet provide a way to read the
// PoX contract's delegation map. Therefore, this data must be fetched by other
// means. In this case, using `@stacks/blockchain-api-client`.
const basePath =
  NETWORK === 'testnet'
    ? 'https://stacks-node-api.testnet.stacks.co'
    : 'https://stacks-node-api.mainnet.stacks.co';
const config = new Configuration({ basePath });
const transactionsApi = new TransactionsApi(config);

/**
 * Returns the address that initiated the current account's stacking. If the account isn't stacking,
 * returns `null`.
 */
export function useStackingInitiatedByQuery() {
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

  const q = useGetAccountExtendedBalancesQuery();

  const txId = (q.data?.stx as any)?.lock_tx_id as string | undefined;

  return useQuery(
    ['stacker'],
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
