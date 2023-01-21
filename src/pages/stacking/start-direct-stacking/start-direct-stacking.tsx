import { useState } from 'react';

import {
  useGetAccountBalance,
  useGetPoxInfoQuery,
  useGetSecondsUntilNextCycleQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';
import { StackingClient } from '@stacks/stacking';
import { Form, Formik } from 'formik';

import { StartStackingLayout } from '../components/stacking-layout';
import { DirectStackingIntro } from './components/direct-stacking-intro';
import { useNavigate } from 'react-router-dom';
import { createHandleSubmit, createValidationSchema } from './utils';
import { Box, Divider, Loader, Stack, Title } from '@mantine/core';
import { ErrorAlert } from '@components/error-alert';
import { DirectStackingFormValues } from './types';
import { useCalculateFee } from '@hooks/use-calculate-fee';
import { STACKING_CONTRACT_CALL_TX_BYTES } from '@constants/index';
import { Amount } from './components/choose-amount';
import { Duration } from './components/duration';
import { PoxAddress } from './components/pox-address/pox-address';
import { useNetwork } from '@components/network-provider';
import { ConfirmAndSubmit } from './components/confirm-and-submit';
import { InfoPanel } from './components/direct-stacking-info-card';

const initialFormValues: DirectStackingFormValues = {
  amount: '',
  lockPeriod: 1,
  poxAddress: '',
};

export function StartDirectStacking() {
  const { client } = useStackingClient();

  if (!client) {
    const msg = 'Expected `client` to be defined.';
    const id = '32bd8efa-c6cb-4d1c-8f92-f39cd7f3cd74';
    console.error(msg);
    return <ErrorAlert id={id}>{msg}</ErrorAlert>;
  }

  return <StartDirectStackingLayout client={client} />;
}

interface StartDirectStackingLayoutProps {
  client: StackingClient;
}
function StartDirectStackingLayout({ client }: StartDirectStackingLayoutProps) {
  const [isContractCallExtensionPageOpen, setIsContractCallExtensionPageOpen] = useState(false);
  const { networkName } = useNetwork();

  const getSecondsUntilNextCycleQuery = useGetSecondsUntilNextCycleQuery();
  const getPoxInfoQuery = useGetPoxInfoQuery();
  const getAccountBalanceQuery = useGetAccountBalance();

  const navigate = useNavigate();
  const calcFee = useCalculateFee();
  const transactionFeeUStx = calcFee(STACKING_CONTRACT_CALL_TX_BYTES);

  if (
    getSecondsUntilNextCycleQuery.isLoading ||
    getPoxInfoQuery.isLoading ||
    getAccountBalanceQuery.isLoading
  )
    return <Loader />;

  if (
    getSecondsUntilNextCycleQuery.isError ||
    typeof getSecondsUntilNextCycleQuery.data !== 'number' ||
    getPoxInfoQuery.isError ||
    !getPoxInfoQuery.data ||
    getAccountBalanceQuery.isError ||
    typeof getAccountBalanceQuery.data !== 'bigint'
  ) {
    const msg = 'Failed to load necessary data.';
    const id = '8c12f6b2-c839-4813-8471-b0fd542b845f';
    console.error(id, msg);
    return <ErrorAlert id={id}>{msg}</ErrorAlert>;
  }

  const validationSchema = createValidationSchema({
    minimumAmountUStx: BigInt(getPoxInfoQuery.data.min_amount_ustx),
    transactionFeeUStx,
    availableBalanceUStx: getAccountBalanceQuery.data,
    network: networkName,
  });
  const handleSubmit = createHandleSubmit({ client, navigate, setIsContractCallExtensionPageOpen });

  return (
    <>
      <Formik
        initialValues={initialFormValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <StartStackingLayout
          intro={
            <DirectStackingIntro
              estimatedStackingMinimum={BigInt(getPoxInfoQuery.data.min_amount_ustx)}
              timeUntilNextCycle={getSecondsUntilNextCycleQuery.data}
            />
          }
          stackingInfoPanel={<InfoPanel />}
          stackingForm={
            <Form>
              <Stack>
                <Amount />
                <Divider />
                <Duration />
                <Divider />
                <PoxAddress />
                <ConfirmAndSubmit isLoading={isContractCallExtensionPageOpen} />
              </Stack>
            </Form>
          }
        />
      </Formik>
      <Box pb="25vh" />
    </>
  );
}
