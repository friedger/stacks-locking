import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { StackingFormContainer } from '../components/stacking-form-container';
import { StackingFormInfoPanel } from '../components/stacking-form-info-panel';
import { StartStackingLayout } from '../components/stacking-layout';
import { Amount } from './components/choose-amount';
import { ConfirmAndSubmit } from './components/confirm-and-submit';
import { InfoPanel } from './components/direct-stacking-info-card/direct-stacking-info-card';
import { DirectStackingIntro } from './components/direct-stacking-intro';
import { Duration } from './components/duration';
import { PoxAddress } from './components/pox-address/pox-address';
import { DirectStackingFormValues } from './types';
import { createHandleSubmit, createValidationSchema } from './utils';
import { ErrorAlert } from '@components/error-alert';
import { useNetwork } from '@components/network-provider';
import {
  useGetAccountBalanceQuery,
  useGetPoxInfoQuery,
  useGetSecondsUntilNextCycleQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';
import { STACKING_CONTRACT_CALL_TX_BYTES } from '@constants/app';
import { useCalculateFee } from '@hooks/use-calculate-fee';
import { StackingClient } from '@stacks/stacking';
import { Spinner } from '@stacks/ui';
import { Form, Formik } from 'formik';
import { useAuth } from '@components/auth-provider/auth-provider';

const initialFormValues: DirectStackingFormValues = {
  amount: '',
  lockPeriod: 12,
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
  const getAccountBalanceQuery = useGetAccountBalanceQuery();
  const { btcAddressP2wpkh } = useAuth();

  const navigate = useNavigate();
  const calcFee = useCalculateFee();
  const transactionFeeUStx = calcFee(STACKING_CONTRACT_CALL_TX_BYTES);

  if (
    getSecondsUntilNextCycleQuery.isLoading ||
    getPoxInfoQuery.isLoading ||
    getAccountBalanceQuery.isLoading
  )
    return <Spinner />;

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
  const handleSubmit = createHandleSubmit({
    client,
    navigate,
    setIsContractCallExtensionPageOpen,
  });

  return (
    <Formik
      initialValues={{ ...initialFormValues, poxAddress: btcAddressP2wpkh || '' }}
      onSubmit={values => {
        handleSubmit(values);
      }}
      validationSchema={validationSchema}
    >
      <StartStackingLayout
        intro={
          <DirectStackingIntro
            estimatedStackingMinimum={BigInt(getPoxInfoQuery.data.min_amount_ustx)}
            timeUntilNextCycle={getSecondsUntilNextCycleQuery.data}
          />
        }
        stackingInfoPanel={
          <>
            <StackingFormInfoPanel>
              <InfoPanel />
            </StackingFormInfoPanel>
          </>
        }
        stackingForm={
          <Form>
            <StackingFormContainer>
              <Amount />
              <Duration />
              <PoxAddress />
              <ConfirmAndSubmit isLoading={isContractCallExtensionPageOpen} />
            </StackingFormContainer>
          </Form>
        }
      />
    </Formik>
  );
}
