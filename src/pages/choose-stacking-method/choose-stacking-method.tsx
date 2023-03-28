import { useDelegationStatusQuery } from '../stacking/pooled-stacking-info/use-delegation-status-query';
import { useStackingInitiatedByQuery } from './use-stacking-initiated-by';
import { useAuth } from '@components/auth-provider/auth-provider';
import {
  useGetAccountBalanceQuery,
  useGetAccountBalanceLockedQuery,
  useGetPoxInfoQuery,
} from '@components/stacking-client-provider/stacking-client-provider';
import { ChooseStackingMethodLayout } from './choose-stacking-method.layout';
import { CenteredSpinner } from '@components/centered-spinner';
import { CenteredErrorAlert } from '@components/centered-error-alert';
import { Box } from '@stacks/ui';
import { Banner } from '../sign-in/banner';

export function ChooseStackingMethod() {
  return (
    <Box>
      <Banner />
      <ChooseStackingMethodAuthHandler />
    </Box>
  );
}

export function ChooseStackingMethodAuthHandler() {
  const { isSignedIn } = useAuth();
  return isSignedIn ? <ChooseStackingMethodSignedIn /> : <ChooseStackingMethodSignedOut />;
}

export function ChooseStackingMethodSignedOut() {
  return <ChooseStackingMethodLayout isSignedIn={false} />;
}

export function ChooseStackingMethodSignedIn() {
  const { address } = useAuth();
  const delegationStatusQuery = useDelegationStatusQuery();
  const getAccountBalanceLockedQuery = useGetAccountBalanceLockedQuery();
  const stackingInitiatedByQuery = useStackingInitiatedByQuery();
  const getAccountBalanceQuery = useGetAccountBalanceQuery();
  const getPoxInfoQuery = useGetPoxInfoQuery();

  if (
    delegationStatusQuery.isLoading ||
    getAccountBalanceLockedQuery.isLoading ||
    stackingInitiatedByQuery.isLoading ||
    getAccountBalanceQuery.isLoading ||
    getPoxInfoQuery.isLoading
  ) {
    return <CenteredSpinner />;
  }

  if (
    delegationStatusQuery.isError ||
    !delegationStatusQuery.data ||
    getAccountBalanceLockedQuery.isError ||
    typeof getAccountBalanceLockedQuery.data !== 'bigint' ||
    stackingInitiatedByQuery.isError ||
    !stackingInitiatedByQuery.data ||
    getAccountBalanceQuery.isError ||
    typeof getAccountBalanceQuery.data !== 'bigint' ||
    getPoxInfoQuery.isError ||
    !getPoxInfoQuery.data
  ) {
    const msg = 'Error retrieving stacking or delegation info.';
    const id = 'beae38f3-59fb-4e0f-abdc-b837e2b6ebde';
    console.error(
      id,
      msg,
      delegationStatusQuery,
      getAccountBalanceLockedQuery,
      stackingInitiatedByQuery,
      getAccountBalanceQuery,
      getPoxInfoQuery
    );
    return <CenteredErrorAlert id={id}>{msg}</CenteredErrorAlert>;
  }

  const stackingMinimumAmountUstx = BigInt(getPoxInfoQuery.data.min_amount_ustx);
  const hasEnoughBalanceToPool = getAccountBalanceQuery.data > 0;
  const hasEnoughBalanceToDirectStack = getAccountBalanceQuery.data > stackingMinimumAmountUstx;

  const isStacking = getAccountBalanceLockedQuery.data !== 0n;
  const hasExistingDelegation = delegationStatusQuery.data.isDelegating;
  // TODO delegated Stacking can be initiated by the user itself via self-service delegation pool
  const hasExistingDelegatedStacking =
    isStacking && address !== stackingInitiatedByQuery.data.address;
  const hasExistingDirectStacking = isStacking && address === stackingInitiatedByQuery.data.address;
  return (
    <ChooseStackingMethodLayout
      isSignedIn={true}
      hasExistingDelegation={hasExistingDelegation}
      hasExistingDelegatedStacking={hasExistingDelegatedStacking}
      hasExistingDirectStacking={hasExistingDirectStacking}
      hasEnoughBalanceToPool={hasEnoughBalanceToPool}
      hasEnoughBalanceToDirectStack={hasEnoughBalanceToDirectStack}
      stackingMinimumAmountUstx={stackingMinimumAmountUstx}
    />
  );
}
