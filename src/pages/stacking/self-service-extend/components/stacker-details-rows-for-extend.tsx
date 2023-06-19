import { DelegationInfo, StackerInfo } from '@stacks/stacking';
import { Text } from '@stacks/ui';

import { Address } from '@components/address';
import { Alert, AlertText } from '@components/alert';
import { CenteredErrorAlert } from '@components/centered-error-alert';
import { Hr } from '@components/hr';
import {
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardValue as Value,
} from '@components/info-card';
import { formatPoxAddressToNetwork } from '@utils/stacking';
import { truncateMiddle } from '@utils/tx-utils';

import { StackerDetailsRows } from '../../components/stacker-details-rows';
import { DelegationStatus } from '../../pooled-stacking-info/get-delegation-status';
import { isSelfServicePool } from '../../start-pooled-stacking/utils-preset-pools';

interface StackerDetailsRowsForUserExtendProps {
  address: string;
  stackerInfoDetails: (StackerInfo & { stacked: true })['details'] | undefined;
  delegationStatus: DelegationInfo;
  delegationStatus2: DelegationStatus;
  requiresExtension: boolean;
}
export function StackerDetailsRowsForUserExtend({
  address,
  stackerInfoDetails,
  delegationStatus,
  delegationStatus2,
  requiresExtension,
}: StackerDetailsRowsForUserExtendProps) {
  if (!delegationStatus.delegated || !delegationStatus2.isDelegating) {
    return (
      <CenteredErrorAlert>
        User {truncateMiddle(address)} is not part of any pool.
      </CenteredErrorAlert>
    );
  }
  // getDelegationStatusQuery.data.delegated_to only return the contract address
  const poolStxAddress = delegationStatus2.details.delegatedTo;
  const canExtend = isSelfServicePool(poolStxAddress);

  const requiredPoxAddress = delegationStatus.details.pox_address
    ? formatPoxAddressToNetwork(delegationStatus.details.pox_address)
    : undefined;
  const stackedPoxAddress = stackerInfoDetails?.pox_address
    ? formatPoxAddressToNetwork(stackerInfoDetails.pox_address)
    : undefined;

  if (!requiresExtension) {
    return <Text>User is already stacking for the next cycle. No need to lock again now.</Text>;
  }
  return (
    <>
      {stackerInfoDetails && stackedPoxAddress && (
        <StackerDetailsRows
          stackerInfoDetails={stackerInfoDetails}
          poxAddress={stackedPoxAddress}
        />
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

          <Hr />

          <Text>Lock their delegated STX for 1 more cycle.</Text>
        </>
      ) : (
        <Alert>
          <AlertText>User is not stacking with a Self-Service Pool.</AlertText>
        </Alert>
      )}
    </>
  );
}
