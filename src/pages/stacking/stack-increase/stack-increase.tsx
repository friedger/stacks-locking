import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Text } from '@stacks/ui';
import BigNumber from 'bignumber.js';
import { Form, Formik } from 'formik';

import { CenteredErrorAlert } from '@components/centered-error-alert';
import { CenteredSpinner } from '@components/centered-spinner';
import {
  useGetAccountExtendedBalancesQuery,
  useGetStatusQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';
import { STACKING_CONTRACT_CALL_TX_BYTES } from '@constants/app';
import { useCalculateFee } from '@hooks/use-calculate-fee';
import { microStxToStxRounded } from '@utils/unit-convert';

import { useGetHasPendingStackingTransactionQuery } from '../direct-stacking-info/use-get-has-pending-tx-query';
import { StackIncreaseLayout } from './components/stack-increase-layout';
import { createHandleSubmit, createValidationSchema, getAvailableAmountUstx } from './utils';

export function StackIncrease() {
  const calcFee = useCalculateFee();
  const transactionFeeUStx = calcFee(STACKING_CONTRACT_CALL_TX_BYTES);

  const navigate = useNavigate();
  const getStatusQuery = useGetStatusQuery();
  const getAccountExtendedBalancesQuery = useGetAccountExtendedBalancesQuery();
  const { getHasPendingStackIncreaseQuery } = useGetHasPendingStackingTransactionQuery();

  const { client } = useStackingClient();
  const [isContractCallExtensionPageOpen, setIsContractCallExtensionPageOpen] = useState(false);
  if (
    getStatusQuery.isLoading ||
    getAccountExtendedBalancesQuery.isLoading ||
    getHasPendingStackIncreaseQuery.isLoading
  ) {
    return <CenteredSpinner />;
  }

  if (
    getStatusQuery.isError ||
    !getStatusQuery.data ||
    getAccountExtendedBalancesQuery.isError ||
    !getAccountExtendedBalancesQuery.data ||
    getHasPendingStackIncreaseQuery.isError ||
    getHasPendingStackIncreaseQuery.data === undefined ||
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
    return (
      <CenteredErrorAlert>
        <Text>Not stacking</Text>
      </CenteredErrorAlert>
    );
  }

  const extendedStxBalances = getAccountExtendedBalancesQuery.data.stx;
  const availableBalanceUStx = getAvailableAmountUstx(
    extendedStxBalances,
    getHasPendingStackIncreaseQuery.data
  );

  const handleSubmit = createHandleSubmit({
    client,
    navigate,
    setIsContractCallExtensionPageOpen,
  });

  const validationSchema = createValidationSchema({
    availableBalanceUStx: availableBalanceUStx,
    transactionFeeUStx,
  });

  return (
    <Formik
      initialValues={{
        increaseBy: microStxToStxRounded(availableBalanceUStx),
      }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <Form>
        <StackIncreaseLayout
          title="Lock more STX"
          extendedStxBalances={getAccountExtendedBalancesQuery.data.stx}
          pendingStackIncrease={getHasPendingStackIncreaseQuery.data}
          isContractCallExtensionPageOpen={isContractCallExtensionPageOpen}
        />
      </Form>
    </Formik>
  );
}
