import { useState } from 'react';

import { FinishedTxData } from '@stacks/connect';
import { StackingClient } from '@stacks/stacking';
import { Form, Formik } from 'formik';

import { CenteredErrorAlert } from '@components/centered-error-alert';
import { CenteredSpinner } from '@components/centered-spinner';
import { FinishedTxResultInfo } from '@components/finished-tx-result-info';
import {
  useGetAccountExtendedBalancesQuery,
  useGetPoxInfoQuery,
  useGetSecondsUntilNextCycleQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';
import { useStacksNetwork } from '@hooks/use-stacks-network';

import { ConfirmAndSubmit } from '../../components/confirm-and-submit';
import { StackingFormInfoPanel } from '../../components/stacking-form-info-panel';
import { PoxAddress } from '../../start-direct-stacking/components/pox-address/pox-address';
import { Amount } from '../components/choose-amount';
import { Stacker } from '../components/choose-stacker';
import { PoolAdminIntro } from '../components/pool-admin-intro';
import { PoolAdminLayout } from '../components/pool-admin-layout';
import { PooledStackingFormContainer } from '../components/pooled-stacking-form-container';
import { InfoPanel } from './components/delegate-stack-increase-info-card';
import { DelegateStackIncreaseFormValues } from './types';
import { createHandleSubmit, createValidationSchema } from './utils';

const initialFormValues: DelegateStackIncreaseFormValues = {
  stacker: '',
  amount: '',
  poxAddress: '',
  totalAmount: undefined,
  lockedAmount: undefined,
  unlockHeight: undefined,
  delegated: undefined,
  delegatedTo: undefined,
  delegatedAmount: undefined,
};

export function DelegateStackIncrease() {
  const { client } = useStackingClient();

  if (!client) {
    const msg = 'Expected `client` to be defined.';
    const id = '32bd8efa-c6cb-4d1c-8f92-f39cd7f3cd74';
    console.error(msg);
    return <CenteredErrorAlert id={id}>{msg}</CenteredErrorAlert>;
  }

  return <DelegateStackIncreaseLayout client={client} />;
}

interface DelegateStackIncreaseLayoutProps {
  client: StackingClient;
}

function DelegateStackIncreaseLayout({ client }: DelegateStackIncreaseLayoutProps) {
  const [isContractCallExtensionPageOpen, setIsContractCallExtensionPageOpen] = useState(false);
  const [txResult, setTxResult] = useState<FinishedTxData | undefined>();

  const { networkName, network } = useStacksNetwork();

  const getSecondsUntilNextCycleQuery = useGetSecondsUntilNextCycleQuery();
  const getPoxInfoQuery = useGetPoxInfoQuery();
  const getAccountExtendedBalancesQuery = useGetAccountExtendedBalancesQuery();

  if (
    getSecondsUntilNextCycleQuery.isLoading ||
    getPoxInfoQuery.isLoading ||
    getAccountExtendedBalancesQuery.isLoading
  )
    return <CenteredSpinner />;

  if (
    getSecondsUntilNextCycleQuery.isError ||
    typeof getSecondsUntilNextCycleQuery.data !== 'number' ||
    getPoxInfoQuery.isError ||
    !getPoxInfoQuery.data ||
    getAccountExtendedBalancesQuery.isError ||
    typeof getAccountExtendedBalancesQuery.data.stx.balance !== 'string'
  ) {
    const msg = 'Failed to load necessary data.';
    const id = '8c12f6b2-c839-4813-8471-b0fd542b845f';
    console.error(id, msg);
    return <CenteredErrorAlert id={id}>{msg}</CenteredErrorAlert>;
  }

  const validationSchema = createValidationSchema({
    network: networkName,
  });
  const handleSubmit = createHandleSubmit({
    client,
    setIsContractCallExtensionPageOpen,
    setTxResult,
    network,
  });

  return (
    <Formik
      initialValues={{
        ...initialFormValues,
        startBurnHt: getPoxInfoQuery.data.current_burnchain_block_height
          ? getPoxInfoQuery.data.current_burnchain_block_height + 10
          : 0,
      }}
      onSubmit={values => {
        handleSubmit(values);
      }}
      validationSchema={validationSchema}
    >
      <PoolAdminLayout
        intro={
          <PoolAdminIntro
            estimatedStackingMinimum={BigInt(getPoxInfoQuery.data.min_amount_ustx)}
            timeUntilNextCycle={getSecondsUntilNextCycleQuery.data}
          >
            You can increase the locked amount for an existing pool member. The amount will be used
            from the next cycle onwards.
          </PoolAdminIntro>
        }
        poolAdminPanel={
          <>
            <StackingFormInfoPanel>
              <InfoPanel />
            </StackingFormInfoPanel>
          </>
        }
        poolAdminForm={
          <Form>
            <>
              <PooledStackingFormContainer>
                <Stacker />
                <Amount />
                <PoxAddress />
                <ConfirmAndSubmit
                  isLoading={isContractCallExtensionPageOpen}
                  title="Increase stacking amount"
                  actionLabel="Confirm and lock more"
                />
              </PooledStackingFormContainer>
              {txResult && <FinishedTxResultInfo txResult={txResult} />}
            </>
          </Form>
        }
      />
    </Formik>
  );
}
