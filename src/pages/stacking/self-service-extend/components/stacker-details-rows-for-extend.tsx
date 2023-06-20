import { DelegationInfo } from '@stacks/stacking';
import { Text } from '@stacks/ui';
import { StackerInfoDetails } from 'src/types/stacking';

import { Address } from '@components/address';
import { Alert, AlertText } from '@components/alert';
import { CenteredErrorAlert } from '@components/centered-error-alert';
import { Hr } from '@components/hr';
import {
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardValue as Value,
} from '@components/info-card';
import { useStacksNetwork } from '@hooks/use-stacks-network';
import { formatPoxAddressToNetwork } from '@utils/stacking';
import { truncateMiddle } from '@utils/tx-utils';

import { StackerDetailsRows } from '../../components/stacker-details-rows';
import { isSelfServicePool } from '../../start-pooled-stacking/utils-preset-pools';

interface StackerDetailsRowsForUserExtendProps {
  address: string;
  stackerInfoDetails: StackerInfoDetails | undefined;
  delegationStatus: DelegationInfo;
  requiresExtension: boolean;
}
export function StackerDetailsRowsForUserExtend({
  address,
  stackerInfoDetails,
  delegationStatus,
  requiresExtension,
}: StackerDetailsRowsForUserExtendProps) {
  const { network } = useStacksNetwork();
  if (!delegationStatus.delegated) {
    return (
      <CenteredErrorAlert>
        User {truncateMiddle(address)} is not part of any pool.
      </CenteredErrorAlert>
    );
  }
  const poolStxAddress = delegationStatus.details.delegated_to;
  const canExtend = isSelfServicePool(poolStxAddress);

  const requiredPoxAddress = delegationStatus.details.pox_address
    ? formatPoxAddressToNetwork(network, delegationStatus.details.pox_address)
    : undefined;
  const stackedPoxAddress = stackerInfoDetails?.pox_address
    ? formatPoxAddressToNetwork(network, stackerInfoDetails.pox_address)
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
