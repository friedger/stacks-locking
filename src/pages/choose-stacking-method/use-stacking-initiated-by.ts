import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types';
import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@components/auth-provider/auth-provider';
import { useBlockchainApiClient } from '@components/blockchain-api-client-provider';
import { useGetAccountExtendedBalancesQuery } from '@components/stacking-client-provider/stacking-client-provider';

import { isSelfServicePool } from '../stacking/start-pooled-stacking/utils-preset-pools';

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

  // Typecast needed due to fields missing from types,
  // https://github.com/hirosystems/stacks.js/issues/1437
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txId = (q.data?.stx as any)?.lock_tx_id as string | undefined;

  return useQuery(
    ['stacker', txId, address, transactionsApi],
    async () => {
      if (!txId) return { address: null } as const;

      const res = (await transactionsApi.getTransactionById({
        txId,
        // https://github.com/hirosystems/stacks-blockchain-api/tree/master/client#known-issues
      })) as ContractCallTransaction;
      if (isStackingWithSelfServicePool(res)) {
        return { address: res.contract_call.contract_id };
      } else {
        return { address: res.sender_address };
      }
    },
    { enabled: !q.isLoading }
  );
}

function isStackingWithSelfServicePool(t: ContractCallTransaction) {
  return isSelfServicePool(t.contract_call.contract_id);
}
