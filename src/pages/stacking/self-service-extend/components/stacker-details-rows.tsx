import { StacksNetwork } from '@stacks/network';
import { PoxInfo, StackerInfo, StackingClient } from '@stacks/stacking';
import { Text } from '@stacks/ui';

import { Address } from '@components/address';
import { Alert, AlertText } from '@components/alert';
import { CenteredErrorAlert } from '@components/centered-error-alert';
import { CenteredSpinner } from '@components/centered-spinner';
import {
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardValue as Value,
} from '@components/info-card';
import {
  useGetConfirmedDelegationStatus,
  useGetPoxInfoQuery,
  useGetStatusWithClientQuery,
} from '@components/stacking-client-provider/stacking-client-provider';
import { formatPoxAddressToNetwork } from '@utils/stacking';
import { truncateMiddle } from '@utils/tx-utils';

import { useDelegationStatusForUserQuery } from '../../pooled-stacking-info/use-delegation-status-query';
import { isSelfServicePool } from '../../start-pooled-stacking/utils-preset-pools';

interface StackerDetailsRowsForUserProps {
  address: string;
  nextRewardCycleId: number;
  network: StacksNetwork;
}
export function StackerDetailsRowsForUser({
  address,
  network,
  nextRewardCycleId,
}: StackerDetailsRowsForUserProps) {
  const getPoxInfoQuery = useGetPoxInfoQuery();
  const client = new StackingClient(address, network);
  const getStatusQuery = useGetStatusWithClientQuery(client);
  const getDelegationStatusQuery = useGetConfirmedDelegationStatus(client);
  const getDelegationStatusQuery2 = useDelegationStatusForUserQuery({ client, address, network });
  if (
    getPoxInfoQuery.isError ||
    !getPoxInfoQuery.data ||
    getStatusQuery.isError ||
    !getStatusQuery.data ||
    getDelegationStatusQuery.isError ||
    !getDelegationStatusQuery.data ||
    getDelegationStatusQuery2.isError ||
    !getDelegationStatusQuery2.data
  ) {
    return <CenteredSpinner />;
  }
  if (!getDelegationStatusQuery.data.delegated || !getDelegationStatusQuery2.data.isDelegating) {
    return (
      <CenteredErrorAlert>
        User {truncateMiddle(address)} is not part of any pool.
      </CenteredErrorAlert>
    );
  }
  // getDelegationStatusQuery.data.delegated_to only return the contract address
  const poolStxAddress = getDelegationStatusQuery2.data.details.delegatedTo;
  const canExtend = isSelfServicePool(poolStxAddress);

  const requiredPoxAddress = getDelegationStatusQuery.data.details.pox_address
    ? formatPoxAddressToNetwork(getDelegationStatusQuery.data.details.pox_address)
    : undefined;

  const stackerInfoDetails = getStatusQuery.data.stacked ? getStatusQuery.data.details : undefined;
  const stackedPoxAddress = stackerInfoDetails?.pox_address
    ? formatPoxAddressToNetwork(stackerInfoDetails.pox_address)
    : undefined;

  const extendingDone =
    stackerInfoDetails?.unlock_height &&
    isAfterEndOfCycle(stackerInfoDetails?.unlock_height, nextRewardCycleId, getPoxInfoQuery.data);

  return (
    <>
      {extendingDone ? (
        <Text>User is already stacking for the next cycle. No need to lock again now.</Text>
      ) : (
        <>
          {stackerInfoDetails && stackedPoxAddress ? (
            <StackerDetailsRows
              stackerInfoDetails={stackerInfoDetails}
              poxAddress={stackedPoxAddress}
            />
          ) : (
            <></>
          )}
          {canExtend ? (
            <>
              <Row>
                <Label>Pool address</Label>
                <Value>
                  <Address address={poolStxAddress} />
                </Value>
              </Row>
              {requiredPoxAddress && (
                <Row>
                  <Label>Required pool reward address</Label>
                  <Value>
                    <Address address={requiredPoxAddress} />
                  </Value>
                </Row>
              )}
            </>
          ) : (
            <Alert>
              <AlertText>User is not stacking with a Self-Service Pool.</AlertText>
            </Alert>
          )}
        </>
      )}
    </>
  );
}

interface StackerDetailsRowsProps {
  stackerInfoDetails: (StackerInfo & { stacked: true })['details'];
  poxAddress: string;
}
export function StackerDetailsRows({ stackerInfoDetails, poxAddress }: StackerDetailsRowsProps) {
  return (
    <>
      <Row>
        <Label>Start</Label>
        <Value>Cycle {stackerInfoDetails.first_reward_cycle} </Value>
      </Row>
      <Row>
        <Label explainer="STX will unlock after that cycle">End</Label>
        <Value>
          Cycle {stackerInfoDetails.first_reward_cycle + stackerInfoDetails.lock_period - 1}{' '}
        </Value>
      </Row>

      <Row>
        <Label>Pool reward address</Label>
        <Value>
          <Address address={poxAddress} />
        </Value>
      </Row>
    </>
  );
}
function isAfterEndOfCycle(unlock_height: number, cycleId: number, poxInfo: PoxInfo) {
  const endOfCycle = // equals beginning of the next cycle
    (cycleId + 1) * poxInfo.reward_cycle_length + poxInfo.first_burnchain_block_height;
  return unlock_height >= endOfCycle;
}
