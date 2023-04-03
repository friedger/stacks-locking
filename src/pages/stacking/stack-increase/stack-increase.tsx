import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ContractCallRegularOptions, openContractCall } from '@stacks/connect';
import { Text } from '@stacks/ui';
import BigNumber from 'bignumber.js';
import { Form, Formik } from 'formik';

import { CenteredErrorAlert } from '@components/centered-error-alert';
import { CenteredSpinner } from '@components/centered-spinner';
import {
  useGetAccountExtendedBalancesQuery,
  useGetPoxInfoQuery,
  useGetStatusQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';
import routes from '@constants/routes';
import { stxToMicroStx } from '@utils/unit-convert';

import { ChangeDirectStackingLayout } from './components/stack-increase-layout';

export function StackIncrease() {
  const navigate = useNavigate();
  const getStatusQuery = useGetStatusQuery();
  const getPoxInfoQuery = useGetPoxInfoQuery();
  const getAccountExtendedBalancesQuery = useGetAccountExtendedBalancesQuery();

  const { client } = useStackingClient();
  const [isContractCallExtensionPageOpen, setIsContractCallExtensionPageOpen] = useState(false);
  if (getStatusQuery.isLoading || getPoxInfoQuery.isLoading) {
    return <CenteredSpinner />;
  }

  if (
    getStatusQuery.isError ||
    !getStatusQuery.data ||
    getPoxInfoQuery.isError ||
    !getPoxInfoQuery.data ||
    getAccountExtendedBalancesQuery.isError ||
    !getAccountExtendedBalancesQuery.data ||
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

  if (!getStatusQuery.data.stacked) {
    navigate('../direct-stacking-info');
    return <></>;
  }

  async function handleLockMore({ increaseBy }: { increaseBy: BigNumber }) {
    if (!client) return;
    const stackingContract = await client.getStackingContract();
    const stackIncreaseOptions = client.getStackIncreaseOptions({
      contract: stackingContract,
      increaseBy: stxToMicroStx(increaseBy).toString(),
    });
    setIsContractCallExtensionPageOpen(true);
    openContractCall({
      // Type coercion necessary because the `network` property returned by
      // `client.getStackingContract()` has a wider type than allowed by `openContractCall`. Despite
      // the wider type, the actual value of `network` is always of the type `StacksNetwork`
      // expected by `openContractCall`.
      //
      // See
      // https://github.com/hirosystems/stacks.js/blob/0e1f9f19dfa45788236c9e481f9a476d9948d86d/packages/stacking/src/index.ts#L1054
      ...(stackIncreaseOptions as ContractCallRegularOptions),
      onCancel() {
        setIsContractCallExtensionPageOpen(false);
      },
      onFinish() {
        setIsContractCallExtensionPageOpen(false);
        navigate(routes.DIRECT_STACKING_INFO);
      },
    });
  }

  const extendedStxBalances = getAccountExtendedBalancesQuery.data.stx;
  return (
    <Formik
      initialValues={{
        increaseBy: new BigNumber(extendedStxBalances.balance.toString())
          .minus(new BigNumber(extendedStxBalances.locked.toString()))
          .dividedToIntegerBy(1_000_000),
      }}
      onSubmit={values => {
        handleLockMore(values);
      }}
      //validationSchema={validationSchema}
    >
      <Form>
        <ChangeDirectStackingLayout
          title="Lock more STX"
          details={getStatusQuery.data.details}
          extendedStxBalances={getAccountExtendedBalancesQuery.data.stx}
          rewardCycleId={getPoxInfoQuery.data.reward_cycle_id}
          isContractCallExtensionPageOpen={isContractCallExtensionPageOpen}
        />
      </Form>
    </Formik>
  );
}
