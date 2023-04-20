
import { Text } from '@stacks/ui';

import { CenteredErrorAlert } from '@components/centered-error-alert';
import { CenteredSpinner } from '@components/centered-spinner';
import {
  useGetAccountExtendedBalancesQuery,
  useGetStatusQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';

import { useGetHasPendingStackingTransactionQuery } from '../direct-stacking-info/use-get-has-pending-tx-query';
import { StackIncreaseLayout } from './components/stack-increase-layout';

export function StackIncrease() {
  const getStatusQuery = useGetStatusQuery();
  const getAccountExtendedBalancesQuery = useGetAccountExtendedBalancesQuery();
  const { getHasPendingStackIncreaseQuery } = useGetHasPendingStackingTransactionQuery();

  const { client } = useStackingClient();
  if (
    getStatusQuery.isLoading ||
    getAccountExtendedBalancesQuery.isLoading ||
    getHasPendingStackIncreaseQuery.isLoading
  ) {
    return <CenteredSpinner />;
  }

  if (
    getStatusQuery.isError ||
    !getStatusQuery.data ||
    getAccountExtendedBalancesQuery.isError ||
    !getAccountExtendedBalancesQuery.data ||
    getHasPendingStackIncreaseQuery.isError ||
    getHasPendingStackIncreaseQuery.data === undefined ||
    !client
  ) {
    const msg = 'Error while loading data, try reloading the page.';
    console.error(msg);
    return (
      <CenteredErrorAlert id="0abc083b-06c7-4795-8491-68264595f1b4">
        <Text>{msg}</Text>
      </CenteredErrorAlert>
    );
  }

  return (
    <StackIncreaseLayout
      title="Lock more STX"
      extendedStxBalances={getAccountExtendedBalancesQuery.data.stx}
    />
  );
}
