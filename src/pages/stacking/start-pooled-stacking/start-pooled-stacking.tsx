import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { StackingFormContainer } from '../components/stacking-form-container';
import { StackingFormInfoPanel } from '../components/stacking-form-info-panel';
import { StartStackingLayout } from '../components/stacking-layout';
import { ChoosePoolingAmount } from './components/choose-pooling-amount';
import { ChoosePoolingDuration } from './components/choose-pooling-duration';
import { ChoosePoolingPool } from './components/choose-pooling-pool';
import { ChoosePoolingRewardAddress } from './components/choose-pooling-reward-address';
import { ConfirmAndSubmit } from './components/confirm-and-pool';
import { PoolingInfoCard } from './components/delegated-stacking-info-card';
import { PooledStackingIntro } from './components/pooled-stacking-intro';
import { pools } from './components/preset-pools';
import { EditingFormValues, PoolWrapperAllowanceState } from './types';
import { PayoutMethod, PoolName, Pox2Contract, usesPoxWrapperContract } from './types-preset-pools';
import { createHandleSubmit } from './utils';
import { createHandleSubmit as createHandleAllowContractCallerSubmit } from './utils-allow-contract-caller';
import {
  createHandleSubmit as createHandleDelegateStxSubmit,
  createValidationSchema,
} from './utils-delegate-stx';
import { useAuth } from '@components/auth-provider/auth-provider';
import { useNetwork } from '@components/network-provider';
import {
  useGetAllowanceContractCallers,
  useGetSecondsUntilNextCycleQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';
import { StacksNetworkName } from '@stacks/network';
import { StackingClient } from '@stacks/stacking';
import { useQuery } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import { StackingGuideInfoCard } from './components/stacking-guide-info-card';
import { ClarityType } from '@stacks/transactions';
import { CenteredSpinner } from '@components/centered-spinner';
import { CenteredErrorAlert } from '@components/centered-error-alert';

const initialDelegatingFormValues: Partial<EditingFormValues> = {
  amount: '',
  poolAddress: '',
  delegationDurationType: undefined,
  numberOfCycles: 1,
};

export function StartPooledStacking() {
  const { client } = useStackingClient();
  const { address, btcAddressP2tr, btcAddressP2wpkh } = useAuth();
  const { networkName } = useNetwork();

  if (!address) {
    const msg = 'Expected `address` to be defined.';
    console.error(msg);
    return <CenteredErrorAlert>{msg}</CenteredErrorAlert>;
  }
  if (!btcAddressP2tr) {
    const msg = 'Expected `btcAddressP2tr` to be defined.';
    console.error(msg);
    return <CenteredErrorAlert>{msg}</CenteredErrorAlert>;
  }
  if (!btcAddressP2wpkh) {
    const msg = 'Expected `btcAddressP2wpkh` to be defined.';
    console.error(msg);
    return <CenteredErrorAlert>{msg}</CenteredErrorAlert>;
  }
  if (!client) {
    const msg = 'Expected `client` to be defined.';
    console.error(msg);
    return <CenteredErrorAlert>{msg}</CenteredErrorAlert>;
  }
  if (!networkName) {
    const msg = 'Expected `networkName` to be defined.';
    console.error(msg);
    return <CenteredErrorAlert>{msg}</CenteredErrorAlert>;
  }

  return (
    <StartPooledStackingLayout
      client={client}
      currentAccountAddresses={{ address, btcAddressP2tr, btcAddressP2wpkh }}
      networkName={networkName}
    />
  );
}

interface StartPooledStackingProps {
  client: StackingClient;
  currentAccountAddresses: {
    address: string;
    btcAddressP2tr: string;
    btcAddressP2wpkh: string;
  };
  networkName: StacksNetworkName;
}
function StartPooledStackingLayout({
  client,
  networkName,
  currentAccountAddresses,
}: StartPooledStackingProps) {
  const [isContractCallExtensionPageOpen, setIsContractCallExtensionPageOpen] = useState(false);
  const [rewardAddressEditable, setRewardAddressEditable] = useState(true);
  const [poolRequiresUserRewardAddress, setPoolRequiresUserRewardAddress] = useState(true);
  const [requiresAllowContractCaller, setRequiresAllowContractCaller] = useState(true);
  // TODO: move this inside ChoosePoolingAmount, not being used elsewhere
  const queryGetAccountBalance = useQuery(['getAccountBalance', client], () =>
    client.getAccountBalance()
  );

  const q1 = useGetSecondsUntilNextCycleQuery();
  const q2 = useGetAllowanceContractCallers(Pox2Contract.WrapperFastPool);
  const q3 = useGetAllowanceContractCallers(Pox2Contract.WrapperOneCycle);

  const [hasUserConfirmedPoolWrapperContract, setHasUserConfirmedPoolWrapperContract] =
    useState<PoolWrapperAllowanceState>({
      [Pox2Contract.PoX2]: true,
      [Pox2Contract.WrapperFastPool]: q2?.data?.type === ClarityType.OptionalSome,
      [Pox2Contract.WrapperOneCycle]: q3?.data?.type === ClarityType.OptionalSome,
    });

  const navigate = useNavigate();
  const { network } = useNetwork();

  const validationSchema = createValidationSchema({
    currentAccountAddress: currentAccountAddresses.address,
    networkName,
  });
  const handleDelegateStxSubmit = createHandleDelegateStxSubmit({
    client,
    network,
    navigate,
    setIsContractCallExtensionPageOpen,
  });
  const handleAllowContractCallerSubmit = createHandleAllowContractCallerSubmit({
    client,
    network,
    setIsContractCallExtensionPageOpen,
  });
  const handleSubmit = createHandleSubmit({
    handleDelegateStxSubmit,
    handleAllowContractCallerSubmit,
    hasUserConfirmedPoolWrapperContract,
    setHasUserConfirmedPoolWrapperContract,
  });

  const onPoolChange = (poolName: PoolName) => {
    if (poolName === PoolName.CustomPool) {
      setRewardAddressEditable(true);
      setPoolRequiresUserRewardAddress(false);
      setRequiresAllowContractCaller(false);
    } else {
      const pool = pools[poolName];
      setRewardAddressEditable(
        pool.payoutMethod === PayoutMethod.BTC && pool.allowCustomRewardAddress === true
      );
      setPoolRequiresUserRewardAddress(pool.payoutMethod === 'BTC');
      setRequiresAllowContractCaller(usesPoxWrapperContract(pool));
    }
  };

  if (q1.isLoading || queryGetAccountBalance.isLoading) return <CenteredSpinner />;

  if (
    q1.isError ||
    typeof q1.data !== 'number' ||
    queryGetAccountBalance.isError ||
    typeof queryGetAccountBalance.data !== 'bigint'
  ) {
    const id = '0106e9bf-ae2f-4fcc-bf00-5fe083001adb';
    const msg = 'Failed to load necessary data.';
    // TODO: log error
    console.error(id, msg);
    return <CenteredErrorAlert id={id}>{msg}</CenteredErrorAlert>;
  }

  return (
    <Formik
      initialValues={
        {
          ...initialDelegatingFormValues,
          rewardAddress: currentAccountAddresses.btcAddressP2wpkh,
        } as EditingFormValues
      }
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <StartStackingLayout
        intro={<PooledStackingIntro timeUntilNextCycle={q1.data} />}
        stackingInfoPanel={
          <StackingFormInfoPanel>
            <PoolingInfoCard />
            <StackingGuideInfoCard />
          </StackingFormInfoPanel>
        }
        stackingForm={
          <>
            <Form>
              <StackingFormContainer>
                <ChoosePoolingPool onPoolChange={onPoolChange} />
                <ChoosePoolingAmount availableBalance={queryGetAccountBalance.data} />
                <ChoosePoolingDuration />
                {poolRequiresUserRewardAddress ? (
                  <ChoosePoolingRewardAddress
                    btcAddress={currentAccountAddresses.btcAddressP2wpkh}
                    editable={rewardAddressEditable}
                  />
                ) : (
                  <></>
                )}
                <ConfirmAndSubmit
                  isLoading={isContractCallExtensionPageOpen}
                  allowContractCallerTxId={''}
                  requiresAllowContractCaller={requiresAllowContractCaller}
                  hasUserConfirmedPoolWrapperContract={hasUserConfirmedPoolWrapperContract}
                  setHasUserConfirmedPoolWrapperContract={setHasUserConfirmedPoolWrapperContract}
                />
              </StackingFormContainer>
            </Form>
          </>
        }
      />
    </Formik>
  );
}
