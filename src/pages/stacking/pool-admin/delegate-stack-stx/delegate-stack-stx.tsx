import { useState } from 'react';

import { intToBigInt } from '@stacks/common';
import { FinishedTxData } from '@stacks/connect';
import { StackingClient } from '@stacks/stacking';
import { Form, Formik } from 'formik';

import { CenteredErrorAlert } from '@components/centered-error-alert';
import { CenteredSpinner } from '@components/centered-spinner';
import { FinishedTxResultInfo } from '@components/finished-tx-result-info';
import {
  useGetPoxInfoQuery,
  useGetSecondsUntilNextCycleQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';
import { UI_IMPOSED_MAX_STACKING_AMOUNT_USTX } from '@constants/app';
import { useStacksNetwork } from '@hooks/use-stacks-network';

import { ConfirmAndSubmit } from '../../components/confirm-and-submit';
import { StackingFormInfoPanel } from '../../components/stacking-form-info-panel';
import { PoxAddress } from '../../start-direct-stacking/components/pox-address/pox-address';
import { Amount } from '../components/choose-amount';
import { Duration } from '../components/choose-duration';
import { Stacker } from '../components/choose-stacker';
import { StartBurnHeight } from '../components/choose-start-burn-height';
import { PoolAdminIntro } from '../components/pool-admin-intro';
import { PoolAdminLayout } from '../components/pool-admin-layout';
import { PooledStackingFormContainer } from '../components/pooled-stacking-form-container';
import { InfoPanel } from './components/delegate-stack-stx-info-card';
import { DelegateStackStxFormValues } from './types';
import { createHandleSubmit, createValidationSchema } from './utils';

const initialFormValues: DelegateStackStxFormValues = {
  stacker: '',
  amount: '',
  lockPeriod: 12,
  poxAddress: '',
  startBurnHt: 0,
  totalAmount: undefined,
  lockedAmount: undefined,
  unlockHeight: undefined,
  delegated: undefined,
  delegatedTo: undefined,
  delegatedAmount: undefined,
};

export function DelegateStackStx() {
  const { client } = useStackingClient();

  if (!client) {
    const msg = 'Expected `client` to be defined.';
    const id = '32bd8efa-c6cb-4d1c-8f92-f39cd7f3cd74';
    console.error(msg);
    return <CenteredErrorAlert id={id}>{msg}</CenteredErrorAlert>;
  }

  return <DelegateStackStxLayout client={client} />;
}

interface DelegateStackStxLayoutProps {
  client: StackingClient;
}

function DelegateStackStxLayout({ client }: DelegateStackStxLayoutProps) {
  const [isContractCallExtensionPageOpen, setIsContractCallExtensionPageOpen] = useState(false);
  const [txResult, setTxResult] = useState<FinishedTxData | undefined>();

  const { networkName, network } = useStacksNetwork();

  const getSecondsUntilNextCycleQuery = useGetSecondsUntilNextCycleQuery();
  const getPoxInfoQuery = useGetPoxInfoQuery();

  if (getSecondsUntilNextCycleQuery.isLoading || getPoxInfoQuery.isLoading)
    return <CenteredSpinner />;

  if (
    getSecondsUntilNextCycleQuery.isError ||
    typeof getSecondsUntilNextCycleQuery.data !== 'number' ||
    getPoxInfoQuery.isError ||
    !getPoxInfoQuery.data
  ) {
    const msg = 'Failed to load necessary data.';
    const id = '8c12f6b2-c839-4813-8471-b0fd542b845f';
    console.error(id, msg);
    return <CenteredErrorAlert id={id}>{msg}</CenteredErrorAlert>;
  }

  const validationSchema = createValidationSchema({
    availableBalanceUStx: intToBigInt(UI_IMPOSED_MAX_STACKING_AMOUNT_USTX.toString(), false),
    // TODO why is current burnchain block height undefined?
    currentBurnHt: getPoxInfoQuery.data.current_burnchain_block_height || 0,
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
            You need to lock STX for your pool members for 1 or more cycles. You also need to
            finalized each cycle.
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
                <Duration />
                <StartBurnHeight />
                <PoxAddress />
                <ConfirmAndSubmit
                  isLoading={isContractCallExtensionPageOpen}
                  title="Lock STX for pool member"
                  actionLabel="Confirm and lock STX"
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
