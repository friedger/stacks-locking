import { useState } from 'react';

import { Text } from '@stacks/ui';
import { Form, Formik } from 'formik';

import { CenteredErrorAlert } from '@components/centered-error-alert';
import { CenteredSpinner } from '@components/centered-spinner';
import {
  useGetStatusQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';
import { useNavigate } from '@hooks/use-navigate';
import { useStacksNetwork } from '@hooks/use-stacks-network';
import { formatPoxAddressToNetwork } from '@utils/stacking';

import { useGetHasPendingStackingTransactionQuery } from '../direct-stacking-info/use-get-has-pending-tx-query';
import { StackExtendLayout } from './components/stack-extend-layout';
import { createHandleSubmit, createValidationSchema } from './utils';

export function StackExtend() {
  const navigate = useNavigate();
  const getStatusQuery = useGetStatusQuery();
  const { getHasPendingStackExtendQuery } = useGetHasPendingStackingTransactionQuery();

  const { client } = useStackingClient();
  const { networkName } = useStacksNetwork();

  const [isContractCallExtensionPageOpen, setIsContractCallExtensionPageOpen] = useState(false);

  if (getStatusQuery.isLoading || getHasPendingStackExtendQuery.isLoading) {
    return <CenteredSpinner />;
  }

  if (
    getStatusQuery.isError ||
    !getStatusQuery.data ||
    getHasPendingStackExtendQuery.isError ||
    getHasPendingStackExtendQuery.data === undefined ||
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

  if (!getStatusQuery.data.stacked) {
    return (
      <CenteredErrorAlert>
        <Text>Not stacking</Text>
      </CenteredErrorAlert>
    );
  }

  const stackerInfoDetails = getStatusQuery.data.details;

  const handleSubmit = createHandleSubmit({
    client,
    navigate,
    setIsContractCallExtensionPageOpen,
  });
  const validationSchema = createValidationSchema({
    stackerInfoDetails,
    network: networkName,
  });
  return (
    <Formik
      initialValues={{
        poxAddress: formatPoxAddressToNetwork(stackerInfoDetails.pox_address),
        extendCycles: 12 - stackerInfoDetails.lock_period,
      }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <Form>
        <StackExtendLayout
          title="Continue stacking"
          details={stackerInfoDetails}
          pendingStackExtend={getHasPendingStackExtendQuery.data}
          isContractCallExtensionPageOpen={isContractCallExtensionPageOpen}
        />
      </Form>
    </Formik>
  );
}
