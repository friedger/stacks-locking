import * as yup from 'yup';
import {
  MIN_DELEGATED_STACKING_AMOUNT_USTX,
  UI_IMPOSED_MAX_STACKING_AMOUNT_USTX,
} from '@constants/index';
import { toHumanReadableStx, stxToMicroStx } from '@utils/unit-convert';
import { stxAddressSchema } from '@utils/validators/stx-address-validator';
import { stxAmountSchema } from '@utils/validators/stx-amount-validator';
import { openContractCall, ContractCallRegularOptions } from '@stacks/connect';
import { cyclesToBurnChainHeight } from '@utils/calculate-burn-height';
import { EditingFormValues } from './types';
import { StackingClient } from '@stacks/stacking';
import { Dispatch, SetStateAction } from 'react';
import { NavigateFunction } from 'react-router-dom';

interface Args {
  /**
   * The address of the currently active account. Used to ensure users don't delegate to themselves,
   * which although technically possible, is most likely not what they want.
   */
  currentAccountAddress: string;
}
export function createValidationSchema({ currentAccountAddress }: Args) {
  return yup.object().shape({
    poolAddress: stxAddressSchema().test({
      name: 'cannot-pool-to-yourself',
      message: 'Cannot pool to your own STX address',
      test(value: any) {
        if (value === null || value === undefined) return false;
        return value !== currentAccountAddress;
      },
    }),
    amountStx: stxAmountSchema()
      .test({
        name: 'test-min-allowed-delegated-stacking',
        message: `You must delegate at least ${toHumanReadableStx(
          MIN_DELEGATED_STACKING_AMOUNT_USTX
        )}`,
        test(value: any) {
          if (value === null || value === undefined) return false;
          const enteredAmount = stxToMicroStx(value);
          return enteredAmount.isGreaterThanOrEqualTo(MIN_DELEGATED_STACKING_AMOUNT_USTX);
        },
      })
      .test({
        name: 'test-max-allowed-delegated-stacking',
        message: `You cannot delegate more than ${toHumanReadableStx(
          UI_IMPOSED_MAX_STACKING_AMOUNT_USTX
        )}`,
        test(value: any) {
          if (value === null || value === undefined) return false;
          const enteredAmount = stxToMicroStx(value);
          return enteredAmount.isLessThanOrEqualTo(UI_IMPOSED_MAX_STACKING_AMOUNT_USTX);
        },
      }),
    delegationDurationType: yup.string().required('Please select the delegation duration type.'),
  });
}

interface CreateHandleSubmitArgs {
  client: StackingClient;
  setIsContractCallExtensionPageOpen: Dispatch<SetStateAction<boolean>>;
  navigate: NavigateFunction;
}
export function createHandleSubmit({
  client,
  setIsContractCallExtensionPageOpen,
  navigate,
}: CreateHandleSubmitArgs) {
  return async function handleSubmit(values: EditingFormValues) {
    // TODO: handle thrown errors
    const [poxInfo, stackingContract] = await Promise.all([
      client.getPoxInfo(),
      client.getStackingContract(),
    ]);
    const delegateStxOptions = client.getDelegateOptions({
      contract: stackingContract,
      amountMicroStx: stxToMicroStx(values.amountStx).toString(),
      delegateTo: values.poolAddress,
      untilBurnBlockHeight:
        values.delegationDurationType === 'limited'
          ? cyclesToBurnChainHeight({
              cycles: values.numberOfCycles,
              rewardCycleLength: poxInfo.reward_cycle_length,
              currentCycleId: poxInfo.current_cycle.id,
              firstBurnchainBlockHeight: poxInfo.first_burnchain_block_height,
            })
          : undefined,
    });

    openContractCall({
      // Type coercion necessary because the `network` property returned by
      // `client.getStackingContract()` has a wider type than allowed by `openContractCall`. Despite
      // the wider type, the actual value of `network` is always of the type `StacksNetwork`
      // expected by `openContractCall`.
      //
      // See
      // https://github.com/hirosystems/stacks.js/blob/0e1f9f19dfa45788236c9e481f9a476d9948d86d/packages/stacking/src/index.ts#L1054
      ...(delegateStxOptions as ContractCallRegularOptions),
      onFinish() {
        setIsContractCallExtensionPageOpen(false);
        navigate('../pooled-stacking-info');
      },
      onCancel() {
        setIsContractCallExtensionPageOpen(false);
      },
    });
    setIsContractCallExtensionPageOpen(true);
  };
}
