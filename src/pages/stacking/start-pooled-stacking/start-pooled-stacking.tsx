import { useEffect, useState } from 'react';

import { StacksNetworkName } from '@stacks/network';
import { StackingClient } from '@stacks/stacking';
import { ClarityType } from '@stacks/transactions';
import { Form, Formik } from 'formik';

import { useAuth } from '@components/auth-provider/auth-provider';
import { CenteredErrorAlert } from '@components/centered-error-alert';
import { CenteredSpinner } from '@components/centered-spinner';
import {
  useGetAllowanceContractCallersQuery,
  useGetSecondsUntilNextCycleQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';
import { useNavigate } from '@hooks/use-navigate';
import { useStacksNetwork } from '@hooks/use-stacks-network';

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
import { PayoutMethod, PoolName, PoxContractName } from './types-preset-pools';
import { createHandleSubmit } from './utils';
import { createHandleSubmit as createHandleAllowContractCallerSubmit } from './utils-allow-contract-caller';
import {
  createHandleSubmit as createHandleDelegateStxSubmit,
  createValidationSchema,
} from './utils-delegate-stx';
import { getPox3Contracts, usesPoxWrapperContract } from './utils-preset-pools';

const initialDelegatingFormValues: Partial<EditingFormValues> = {
  amount: '',
  poolAddress: '',
  delegationDurationType: undefined,
  numberOfCycles: 1,
};

export function StartPooledStacking() {
  const { client } = useStackingClient();
  const { address, btcAddressP2tr, btcAddressP2wpkh } = useAuth();
  const { networkName } = useStacksNetwork();

  if (!address) {
    const msg = 'Expected `address` to be defined.';
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
    btcAddressP2tr: string | null;
    btcAddressP2wpkh: string | null;
  };
  networkName: StacksNetworkName;
}
function StartPooledStackingLayout({
  client,
  networkName,
  currentAccountAddresses,
}: StartPooledStackingProps) {
  const { network, networkInstance } = useStacksNetwork();
  const pox3Contracts = getPox3Contracts(network);
  const [isContractCallExtensionPageOpen, setIsContractCallExtensionPageOpen] = useState(false);
  const [rewardAddressEditable, setRewardAddressEditable] = useState(true);
  const [poolRequiresUserRewardAddress, setPoolRequiresUserRewardAddress] = useState(true);
  const [requiresAllowContractCaller, setRequiresAllowContractCaller] = useState(true);

  const getSecondsUntilNextCycleQuery = useGetSecondsUntilNextCycleQuery();
  const getAllowanceContractCallersFastPoolQuery = useGetAllowanceContractCallersQuery(
    pox3Contracts[PoxContractName.WrapperFastPool]
  );
  const getAllowanceContractCallersOneCycleQuery = useGetAllowanceContractCallersQuery(
    pox3Contracts[PoxContractName.WrapperOneCycle]
  );

  const [hasUserConfirmedPoolWrapperContract, setHasUserConfirmedPoolWrapperContract] =
    useState<PoolWrapperAllowanceState>({});

  useEffect(() => {
    setHasUserConfirmedPoolWrapperContract({
      ...hasUserConfirmedPoolWrapperContract,
      [networkInstance]: {
        [PoxContractName.Pox3]: true,
        [PoxContractName.WrapperFastPool]:
          getAllowanceContractCallersFastPoolQuery?.data?.type === ClarityType.OptionalSome,
        [PoxContractName.WrapperOneCycle]:
          getAllowanceContractCallersOneCycleQuery?.data?.type === ClarityType.OptionalSome,
      },
    });
  }, [
    networkInstance,
    getAllowanceContractCallersFastPoolQuery?.data?.type,
    getAllowanceContractCallersOneCycleQuery?.data?.type,
    hasUserConfirmedPoolWrapperContract,
    setHasUserConfirmedPoolWrapperContract,
  ]);

  const navigate = useNavigate();

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
    network,
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

  if (getSecondsUntilNextCycleQuery.isLoading) return <CenteredSpinner />;

  if (
    getSecondsUntilNextCycleQuery.isError ||
    typeof getSecondsUntilNextCycleQuery.data !== 'number'
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
        intro={<PooledStackingIntro timeUntilNextCycle={getSecondsUntilNextCycleQuery.data} />}
        stackingInfoPanel={
          <StackingFormInfoPanel>
            <PoolingInfoCard />
          </StackingFormInfoPanel>
        }
        stackingForm={
          <>
            <Form>
              <StackingFormContainer>
                <ChoosePoolingPool onPoolChange={onPoolChange} />
                {poolRequiresUserRewardAddress ? (
                  <ChoosePoolingRewardAddress
                    btcAddress={currentAccountAddresses.btcAddressP2wpkh || ''}
                    editable={rewardAddressEditable || !currentAccountAddresses.btcAddressP2wpkh}
                  />
                ) : null}
                <ChoosePoolingAmount />
                <ChoosePoolingDuration />
                <ConfirmAndSubmit
                  isLoading={isContractCallExtensionPageOpen}
                  allowContractCallerTxId={''}
                  requiresAllowContractCaller={requiresAllowContractCaller}
                  hasUserConfirmedPoolWrapperContract={hasUserConfirmedPoolWrapperContract}
                />
              </StackingFormContainer>
            </Form>
          </>
        }
      />
    </Formik>
  );
}
