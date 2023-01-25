import { useState } from 'react';

import {
  useGetSecondsUntilNextCycleQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';
import { StackingClient } from '@stacks/stacking';
import { useQuery } from '@tanstack/react-query';
import { Form, Formik } from 'formik';

import { StartStackingLayout } from '../components/stacking-layout';
import { ChoosePoolAddress } from './components/choose-pool-stx-address';
import { ChoosePoolingAmount } from './components/choose-pooling-amount';
import { ChoosePoolingDuration } from './components/choose-pooling-duration';
import { ConfirmAndSubmit } from './components/confirm-and-pool';
import { PooledStackingIntro } from './components/pooled-stacking-intro';
import { useAuth } from '@components/auth-provider/auth-provider';
import { useNavigate } from 'react-router-dom';
import { createHandleSubmit, createValidationSchema } from './utils';
import { EditingFormValues } from './types';
import { Box, Container, Divider, Stack } from '@mantine/core';
import { ErrorAlert } from '@components/error-alert';
import { PoolingInfoCard } from './components/delegated-stacking-info-card';

const initialDelegatingFormValues: Partial<EditingFormValues> = {
  amount: '',
  poolAddress: '',
  delegationDurationType: undefined,
  numberOfCycles: 1,
};

export function StartPooledStacking() {
  const { client } = useStackingClient();
  const { address } = useAuth();

  if (!address) {
    const msg = 'Expected `address` to be defined.';
    console.error(msg);
    return <ErrorAlert>{msg}</ErrorAlert>;
  }
  if (!client) {
    const msg = 'Expected `client` to be defined.';
    console.error(msg);
    return <ErrorAlert>{msg}</ErrorAlert>;
  }

  return <StartPooledStackingLayout client={client} currentAccountAddress={address} />;
}

interface StartPooledStackingProps {
  client: StackingClient;
  currentAccountAddress: string;
}
function StartPooledStackingLayout({ client, currentAccountAddress }: StartPooledStackingProps) {
  const [isContractCallExtensionPageOpen, setIsContractCallExtensionPageOpen] = useState(false);
  const { data, isLoading } = useGetSecondsUntilNextCycleQuery();

  // TODO: move this inside ChoosePoolingAmount, not being used elsewhere
  const queryGetAccountBalance = useQuery(['getAccountBalance'], () => client.getAccountBalance());
  const navigate = useNavigate();

  const validationSchema = createValidationSchema({ currentAccountAddress });
  const handleSubmit = createHandleSubmit({ client, navigate, setIsContractCallExtensionPageOpen });

  if (isLoading || queryGetAccountBalance.isLoading) return null;
  if (typeof data !== 'number') return null;
  if (typeof queryGetAccountBalance.data !== 'bigint') return null;

  return (
    <Container p={0} size="lg">
      <Formik
        initialValues={initialDelegatingFormValues as EditingFormValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <StartStackingLayout
          intro={<PooledStackingIntro timeUntilNextCycle={data} />}
          stackingInfoPanel={<PoolingInfoCard />}
          stackingForm={
            <Form>
              <Stack>
                <ChoosePoolAddress />
                <Divider />
                <ChoosePoolingAmount availableBalance={queryGetAccountBalance.data} />
                <Divider />
                <ChoosePoolingDuration />
                <Divider />
                <ConfirmAndSubmit isLoading={isContractCallExtensionPageOpen} />
              </Stack>
            </Form>
          }
        />
      </Formik>
      <Box pb="25vh" />
    </Container>
  );
}
