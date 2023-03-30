import { useState } from 'react';

import { FinishedTxData } from '@stacks/connect';
import { StackingClient } from '@stacks/stacking';
import { Form, Formik } from 'formik';

import { CenteredErrorAlert } from '@components/centered-error-alert';
import { CenteredSpinner } from '@components/centered-spinner';
import { useNetwork } from '@components/network-provider';
import {
  useGetAccountExtendedBalancesQuery,
  useGetPoxInfoQuery,
  useGetSecondsUntilNextCycleQuery,
  useStackingClient
} from '@components/stacking-client-provider/stacking-client-provider';

import { FinishedTxResultInfo } from '@components/finished-tx-result-info';
import { StackingFormContainer } from '../../components/stacking-form-container';
import { StackingFormInfoPanel } from '../../components/stacking-form-info-panel';
import { PoxAddress } from '../../start-direct-stacking/components/pox-address/pox-address';
import { RewardCycle } from '../components/choose-reward-cycle';
import { PoolAdminIntro } from '../components/pool-admin-intro';
import { PoolAdminLayout } from '../components/pool-admin-layout';
import { ConfirmAndSubmit } from './components/confirm-and-submit';
import { InfoPanel } from './components/stack-aggregate-commit-info-card';
import { StackAggregationCommitFormValues as StackAggreagtionCommitFormValues } from './types';
import { createHandleSubmit, createValidationSchema } from './utils';

const initialFormValues: StackAggreagtionCommitFormValues = {
  poxAddress: '',
  rewardCycleId: 0,
};

export function StackAggregationCommit() {
  const { client } = useStackingClient();

  if (!client) {
    const msg = 'Expected `client` to be defined.';
    const id = '32bd8efa-c6cb-4d1c-8f92-f39cd7f3cd74';
    console.error(msg);
    return <CenteredErrorAlert id={id}>{msg}</CenteredErrorAlert>;
  }

  return <StackAggregationCommitLayout client={client} />;
}

interface StackAggregationCommitLayoutProps {
  client: StackingClient;
}

function StackAggregationCommitLayout({ client }: StackAggregationCommitLayoutProps) {
  const [isContractCallExtensionPageOpen, setIsContractCallExtensionPageOpen] = useState(false);
  const [txResult, setTxResult] = useState<FinishedTxData | undefined>();

  const { networkName } = useNetwork();

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
  });

  return (
    <Formik
      initialValues={{
        ...initialFormValues,
        rewardCycleId: getPoxInfoQuery.data.reward_cycle_id + 1,
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
          />
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
              <StackingFormContainer>
                <RewardCycle />
                <PoxAddress />
                <ConfirmAndSubmit isLoading={isContractCallExtensionPageOpen} />
              </StackingFormContainer>
              {txResult && <FinishedTxResultInfo txResult={txResult} />}
            </>
          </Form>
        }
      />
    </Formik>
  );
}
