import { useState } from 'react';

import { Text } from '@stacks/ui';
import { Form, Formik } from 'formik';

import { useAuth } from '@components/auth-provider/auth-provider';
import { CenteredErrorAlert } from '@components/centered-error-alert';
import { CenteredSpinner } from '@components/centered-spinner';
import {
  useGetAccountBalanceLockedQuery,
  useGetPoxInfoQuery,
  useGetStatusQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';
import { useNavigate } from '@hooks/use-navigate';
import { useStacksNetwork } from '@hooks/use-stacks-network';

import { SelfServiceLayout } from './components/self-service-extend-layout';
import { createHandleSubmit, createValidationSchema } from './utils';

export function SelfServiceExtend() {
  const navigate = useNavigate();
  const getStatusQuery = useGetStatusQuery();
  const getAccountBalanceLockedQuery = useGetAccountBalanceLockedQuery();
  const getPoxInfoQuery = useGetPoxInfoQuery();

  const { client } = useStackingClient();
  const { address: stacker } = useAuth();
  const { network, networkName } = useStacksNetwork();

  const [isContractCallExtensionPageOpen, setIsContractCallExtensionPageOpen] = useState(false);

  if (
    getStatusQuery.isLoading ||
    getAccountBalanceLockedQuery.isLoading ||
    getPoxInfoQuery.isLoading
  ) {
    return <CenteredSpinner />;
  }

  if (
    getStatusQuery.isError ||
    !getStatusQuery.data ||
    getAccountBalanceLockedQuery.isError ||
    typeof getAccountBalanceLockedQuery.data !== 'bigint' ||
    getPoxInfoQuery.isError ||
    !getPoxInfoQuery.data ||
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

  const stackerInfoDetails = getStatusQuery.data?.stacked
    ? getStatusQuery.data?.details
    : undefined;

  const validationSchema = createValidationSchema({ networkName });
  const handleSubmit = createHandleSubmit({
    client,
    navigate,
    setIsContractCallExtensionPageOpen,
    network,
  });
  return (
    <Formik
      initialValues={{ stacker: stacker || '' }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <Form>
        <SelfServiceLayout
          stackerInfoDetails={stackerInfoDetails}
          lockedBalance={getAccountBalanceLockedQuery.data}
          poxInfo={getPoxInfoQuery.data}
          isContractCallExtensionPageOpen={isContractCallExtensionPageOpen}
        />
      </Form>
    </Formik>
  );
}
