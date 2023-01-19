import { useState } from 'react';

import {
  useGetPoxInfoQuery,
  useGetSecondsUntilNextCycleQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';
import { StackingClient } from '@stacks/stacking';
import { useQuery } from '@tanstack/react-query';
import { addSeconds, formatDistanceToNow } from 'date-fns';
import { Form, Formik } from 'formik';

import { StartStackingLayout } from '../components/stacking-layout';
/* import { ChoosePoolAddress } from './components/choose-pool-stx-address'; */
/* import { ChoosePoolingAmount } from './components/choose-pooling-amount'; */
/* import { ChoosePoolingDuration } from './components/choose-pooling-duration'; */
/* import { ConfirmAndSubmit } from './components/confirm-and-pool'; */
/* import { PooledStackingIntro } from './components/pooled-stacking-intro'; */
import { useNavigate } from 'react-router-dom';
import { createHandleSubmit, createValidationSchema } from './utils';
import { Box, Divider, Loader, Stack, Title } from '@mantine/core';
import { ErrorAlert } from '@components/error-alert';
/* import { PoolingInfoCard } from './components/delegated-stacking-info-card'; */
import { DirectStackingFormValues } from './types';
import { useCalculateFee } from '@hooks/use-calculate-fee';
import { STACKING_CONTRACT_CALL_TX_BYTES } from '@constants/index';

const initialFormValues: DirectStackingFormValues = {
  amountStx: '',
  poxAddress: '',
  lockPeriod: 1,
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

  const getSecondsUntilNextCycleQuery = useGetSecondsUntilNextCycleQuery();
  const getPoxInfoQuery = useGetPoxInfoQuery();
  // TODO: move this inside ChoosePoolingAmount, not being used elsewhere
  const getAccountBalanceQuery = useQuery(['getAccountBalance'], () => client.getAccountBalance());

  const navigate = useNavigate();
  const calcFee = useCalculateFee();
  const transactionFeeUStx = calcFee(STACKING_CONTRACT_CALL_TX_BYTES);

  if (
    getSecondsUntilNextCycleQuery.isLoading ||
    typeof getSecondsUntilNextCycleQuery.data !== 'number' ||
    getPoxInfoQuery.isLoading ||
    !getPoxInfoQuery.data ||
    getAccountBalanceQuery.isLoading ||
    typeof getAccountBalanceQuery.data !== 'bigint'
  )
    return <Loader />;

  const validationSchema = createValidationSchema({
    minimumAmountUStx: BigInt(getPoxInfoQuery.data.min_amount_ustx),
    transactionFeeUStx,
    availableBalanceUStx: getAccountBalanceQuery.data,
  });
  const handleSubmit = createHandleSubmit({ client, navigate, setIsContractCallExtensionPageOpen });
  const timeUntilNextCycle = formatDistanceToNow(
    addSeconds(new Date(), getSecondsUntilNextCycleQuery.data)
  );

  return (
    <>
      <Formik
        initialValues={initialFormValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <Title>Start Direct Stacking</Title>
        {/* <StartStackingLayout */}
        {/*   intro={<PooledStackingIntro timeUntilNextCycle={timeUntilNextCycle} />} */}
        {/*   stackingInfoPanel={<PoolingInfoCard />} */}
        {/*   stackingForm={ */}
        {/*     <Form> */}
        {/*       <Stack> */}
        {/*         <ChoosePoolAddress /> */}
        {/*         <Divider /> */}
        {/*         <ChoosePoolingAmount availableBalance={getAccountBalanceQuery.data} /> */}
        {/*         <Divider /> */}
        {/*         <ChoosePoolingDuration /> */}
        {/*         <Divider /> */}
        {/*         <ConfirmAndSubmit isLoading={isContractCallExtensionPageOpen} /> */}
        {/*       </Stack> */}
        {/*     </Form> */}
        {/*   } */}
        {/* /> */}
      </Formik>
      <Box pb="25vh" />
    </>
  );
}
