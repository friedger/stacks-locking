import { useState } from 'react';

import { Text } from '@stacks/ui';

import { CenteredErrorAlert } from '@components/centered-error-alert';
import { CenteredSpinner } from '@components/centered-spinner';
import { useNetwork } from '@components/network-provider';
import {
  useGetAccountBalanceLockedQuery,
  useGetAccountExtendedBalancesQuery,
  useGetCoreInfoQuery,
  useGetPoxInfoQuery,
  useGetStatusQuery,
} from '@components/stacking-client-provider/stacking-client-provider';

import { ActiveStackingInfo } from './components/active-stacking-info';
import { NoStacking } from './components/no-stacking-info';
import { PendingStackingInfo } from './components/pending-stacking-info';
import { useGetHasPendingDirectStackingQuery } from './use-get-has-pending-direct-stacking';

export function DirectStackingInfo() {
  const [isContractCallExtensionPageOpen, setIsContractCallExtensionPageOpen] = useState(false);

  const { networkName } = useNetwork();
  const getStatusQuery = useGetStatusQuery();
  const getAccountExtendedBalancesQuery = useGetAccountExtendedBalancesQuery();
  const getCoreInfoQuery = useGetCoreInfoQuery();
  const getAccountBalanceLockedQuery = useGetAccountBalanceLockedQuery();
  const getPoxInfoQuery = useGetPoxInfoQuery();
  const getHasPendingDirectStacking = useGetHasPendingDirectStackingQuery();

  if (
    getStatusQuery.isLoading ||
    getAccountExtendedBalancesQuery.isLoading ||
    getCoreInfoQuery.isLoading ||
    getPoxInfoQuery.isLoading ||
    getAccountBalanceLockedQuery.isLoading ||
    getHasPendingDirectStacking.isLoading
  ) {
    return <CenteredSpinner />;
  }

  if (
    getStatusQuery.isError ||
    !getStatusQuery.data ||
    getAccountExtendedBalancesQuery.isError ||
    !getAccountExtendedBalancesQuery.data ||
    getAccountBalanceLockedQuery.isError ||
    typeof getAccountBalanceLockedQuery.data !== 'bigint' ||
    getCoreInfoQuery.isError ||
    !getCoreInfoQuery.data ||
    getPoxInfoQuery.isError ||
    !getPoxInfoQuery.data ||
    getHasPendingDirectStacking.isError ||
    getHasPendingDirectStacking.data === undefined
  ) {
    const msg = 'Error while loading data, try reloading the page.';
    console.error(msg);
    return (
      <CenteredErrorAlert id="0abc083b-06c7-4795-8491-68264595f1b4">
        <Text>{msg}</Text>
      </CenteredErrorAlert>
    );
  }

  const isStacking = getStatusQuery.data.stacked;

  if (!isStacking && getHasPendingDirectStacking.data === null) {
    return <NoStacking />;
  }

  const transactionId = getHasPendingDirectStacking.data?.transactionId;

  if (!isStacking && getHasPendingDirectStacking.data) {
    return (
      <PendingStackingInfo
        data={getHasPendingDirectStacking.data}
        transactionId={transactionId}
        networkName={networkName}
      />
    );
  }

  // This if statement may be unnecessary, as cases for when the account is not stacked should have
  // already been handled above, but the type system can not guarantee this.
  if (!getStatusQuery.data.stacked) {
    const id = 'ee504e56-9cc5-49b4-ae98-a5cac5c35dbf';
    const msg = 'Expected account to be stacked';
    console.error(id, msg);
    return <CenteredErrorAlert id={id}>{msg}</CenteredErrorAlert>;
  }

  return (
    <ActiveStackingInfo
      rewardCycleId={getPoxInfoQuery.data.reward_cycle_id}
      lockedAmount={getAccountBalanceLockedQuery.data}
      stackerInfoDetails={getStatusQuery.data.details}
    />
  );
}
