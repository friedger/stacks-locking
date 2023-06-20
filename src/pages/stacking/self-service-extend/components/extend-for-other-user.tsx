import { useState } from 'react';

import { StackingClient } from '@stacks/stacking';
import { Box, Button, Input, Text } from '@stacks/ui';
import { IconLock } from '@tabler/icons-react';
import { useField } from 'formik';

import { CenteredSpinner } from '@components/centered-spinner';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { InfoCardRow as Row } from '@components/info-card';
import {
  useGetPoxInfoQuery,
  useGetStatusWithClientQuery,
} from '@components/stacking-client-provider/stacking-client-provider';
import { useStacksNetwork } from '@hooks/use-stacks-network';

import { useDelegationStatusForUserQuery } from '../../pooled-stacking-info/use-delegation-status-query';
import { isAtEndOfStackingPeriod } from '../utils';
import { StackerDetailsRowsForUserExtend } from './stacker-details-rows-for-extend';

interface Props {
  onClose: () => void;
  isContractCallExtensionPageOpen: boolean;
}
export function ExtendForOtherUser({ onClose, isContractCallExtensionPageOpen }: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const [field, meta] = useField('stacker');
  const { network } = useStacksNetwork();
  const address = field.value;
  const client = new StackingClient(address, network);
  const getStatusQuery = useGetStatusWithClientQuery(client);
  const getPoxInfoQuery = useGetPoxInfoQuery();
  const getDelegationStatusQuery = useDelegationStatusForUserQuery({ client, address, network });
  if (
    getPoxInfoQuery.isError ||
    !getPoxInfoQuery.data ||
    getDelegationStatusQuery.isError ||
    !getDelegationStatusQuery.data ||
    getStatusQuery.isError ||
    !getStatusQuery.data
  ) {
    return <CenteredSpinner />;
  }

  const stackerInfoDetails = getStatusQuery.data.stacked ? getStatusQuery.data.details : undefined;
  const requiresExtension = stackerInfoDetails
    ? isAtEndOfStackingPeriod(stackerInfoDetails, getPoxInfoQuery.data)
    : true;
  const delegationStatus = getDelegationStatusQuery.data;
  return (
    <>
      {showPreview ? (
        <StackerDetailsRowsForUserExtend
          address={address}
          stackerInfoDetails={stackerInfoDetails}
          delegationStatus={delegationStatus}
          requiresExtension={requiresExtension}
        />
      ) : (
        <Text>
          Enter the Stacks address of a pool member to lock their delegated STX for 1 more cycle.
        </Text>
      )}

      <Box position="relative" maxWidth="400px">
        <Input
          id="stacker"
          placeholder="Stacks address"
          mt="loose"
          isDisabled={showPreview}
          {...field}
        />
        {meta.touched && meta.error && (
          <ErrorLabel>
            <ErrorText>{meta.error}</ErrorText>
          </ErrorLabel>
        )}
      </Box>

      <Row m="loose" justifyContent="space-between">
        <Button mode="tertiary" onClick={onClose}>
          Cancel
        </Button>
        {showPreview ? (
          <Button
            type="submit"
            isLoading={isContractCallExtensionPageOpen}
            isDisabled={!requiresExtension || !delegationStatus.delegated}
          >
            <Box mr="loose">
              <IconLock />
            </Box>
            Lock STX
          </Button>
        ) : (
          <Button
            onClick={e => {
              e.preventDefault();
              setShowPreview(true);
            }}
          >
            Preview
          </Button>
        )}
      </Row>
    </>
  );
}
