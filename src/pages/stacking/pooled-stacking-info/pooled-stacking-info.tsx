import { useState } from 'react';

import { ContractCallRegularOptions, openContractCall } from '@stacks/connect';
import { StackingClient } from '@stacks/stacking';
import { Box, Flex, Text } from '@stacks/ui';

import { CenteredErrorAlert } from '@components/centered-error-alert';
import { CenteredSpinner } from '@components/centered-spinner';
import { InfoCard } from '@components/info-card';
import {
  useGetAccountExtendedBalancesQuery,
  useGetCoreInfoQuery,
  useGetPoxInfoQuery,
  useGetStatusQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';

import { ActivePoolingContent } from './components/content-active-pooling';
import { ExpiredPoolingContent } from './components/content-expired-pooling';
import { RevokedWhileStackingContent } from './components/content-revoked-while-stacking';
import { NoPooling } from './components/no-pooling';
import { useDelegationStatusQuery } from './use-delegation-status-query';
import { useGetPoolAddress } from './use-get-pool-address-query';

export function PooledStackingInfo() {
  const { client } = useStackingClient();
  if (!client) {
    const msg = 'Expected `client` to be defined.';
    console.error(msg);
    return <CenteredErrorAlert id="6f080d24-1e87-45ab-b8f7-41ba9bd53e97">{msg}</CenteredErrorAlert>;
  }

  return <PooledStackingInfoLayout client={client} />;
}

interface CardLayoutProps {
  client: StackingClient;
}
function PooledStackingInfoLayout({ client }: CardLayoutProps) {
  const [isContractCallExtensionPageOpen, setIsContractCallExtensionPageOpen] = useState(false);
  const delegationStatusQuery = useDelegationStatusQuery();
  const getStatusQuery = useGetStatusQuery();
  const getAccountExtendedBalancesQuery = useGetAccountExtendedBalancesQuery();
  const getCoreInfoQuery = useGetCoreInfoQuery();
  const getPoxInfoQuery = useGetPoxInfoQuery();
  const getPoolAddressQuery = useGetPoolAddress();

  if (
    delegationStatusQuery.isLoading ||
    getStatusQuery.isLoading ||
    getAccountExtendedBalancesQuery.isLoading ||
    getCoreInfoQuery.isLoading ||
    getPoolAddressQuery.isLoading ||
    getPoolAddressQuery.isFetching ||
    getPoxInfoQuery.isLoading
  ) {
    return <CenteredSpinner />;
  }

  if (
    delegationStatusQuery.isError ||
    !delegationStatusQuery.data ||
    getStatusQuery.isError ||
    !getStatusQuery.data ||
    getAccountExtendedBalancesQuery.isError ||
    !getAccountExtendedBalancesQuery.data ||
    getPoolAddressQuery.isError ||
    !getPoolAddressQuery.data ||
    getCoreInfoQuery.isError ||
    !getCoreInfoQuery.data ||
    getPoxInfoQuery.isError ||
    !getPoxInfoQuery.data
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
  const poolAddress =
    getPoolAddressQuery.data.address ||
    (delegationStatusQuery.data.delegated
      ? delegationStatusQuery.data.details.delegated_to
      : undefined);
  if ((!delegationStatusQuery.data.delegated && !isStacking) || !poolAddress) {
    return <NoPooling />;
  }

  const isExpired =
    delegationStatusQuery.data.delegated &&
    delegationStatusQuery.data.details.until_burn_ht !== undefined &&
    !Number.isNaN(delegationStatusQuery.data.details.until_burn_ht) &&
    delegationStatusQuery.data.details.until_burn_ht < getCoreInfoQuery.data.burn_block_height;

  async function handleStopPoolingClick() {
    const stackingContract = await client.getStackingContract();
    const revokeDelegationOptions = client.getRevokeDelegateStxOptions(stackingContract);
    setIsContractCallExtensionPageOpen(true);
    openContractCall({
      // Type coercion necessary because the `network` property returned by
      // `client.getStackingContract()` has a wider type than allowed by `openContractCall`. Despite
      // the wider type, the actual value of `network` is always of the type `StacksNetwork`
      // expected by `openContractCall`.
      //
      // See
      // https://github.com/hirosystems/stacks.js/blob/0e1f9f19dfa45788236c9e481f9a476d9948d86d/packages/stacking/src/index.ts#L1054
      ...(revokeDelegationOptions as ContractCallRegularOptions),
      onCancel() {
        setIsContractCallExtensionPageOpen(false);
      },
      onFinish() {
        setIsContractCallExtensionPageOpen(false);
      },
    });
  }
  return (
    <>
      <Flex height="100%" justify="center" align="center">
        <InfoCard width="420px">
          <Box mx={['loose', 'extra-loose']}>
            <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
              {delegationStatusQuery.data.delegated && !isExpired && (
                <ActivePoolingContent
                  delegationInfoDetails={delegationStatusQuery.data.details}
                  isStacking={isStacking}
                  poolAddress={poolAddress}
                  stackerInfo={getStatusQuery.data}
                  extendedStxBalance={getAccountExtendedBalancesQuery.data.stx}
                  isContractCallExtensionPageOpen={isContractCallExtensionPageOpen}
                  handleStopPoolingClick={handleStopPoolingClick}
                />
              )}

              {delegationStatusQuery.data.delegated && isExpired && (
                <ExpiredPoolingContent
                  isContractCallExtensionPageOpen={isContractCallExtensionPageOpen}
                  handleStopPoolingClick={handleStopPoolingClick}
                />
              )}

              {!delegationStatusQuery.data.delegated &&
                isStacking && ( // all cases covered by now
                  <RevokedWhileStackingContent
                    extendedStxBalances={getAccountExtendedBalancesQuery.data.stx}
                    poolAddress={poolAddress}
                  />
                )}
            </Flex>
          </Box>
        </InfoCard>
      </Flex>
    </>
  );
}
