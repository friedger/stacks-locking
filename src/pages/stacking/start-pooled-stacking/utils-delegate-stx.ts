import { Dispatch, SetStateAction } from "react";

import { ContractCallRegularOptions, openContractCall } from "@stacks/connect";
import { StacksNetworkName } from "@stacks/network";
import { poxAddressToTuple, PoxInfo, StackingClient } from "@stacks/stacking";
import { NavigateFunction } from "react-router-dom";
import * as yup from "yup";

import {
  MIN_DELEGATED_STACKING_AMOUNT_USTX,
  UI_IMPOSED_MAX_STACKING_AMOUNT_USTX,
} from "@constants/app";
import { cyclesToBurnChainHeight } from "@utils/calculate-burn-height";
import { stxToMicroStx, toHumanReadableStx } from "@utils/unit-convert";
import { stxAddressSchema } from "@utils/validators/stx-address-validator";
import { stxAmountSchema } from "@utils/validators/stx-amount-validator";

import { EditingFormValues } from "./types";
import { PoolName, PoxContract } from "./types-preset-pools";
import { noneCV, someCV, uintCV } from "@stacks/transactions";
import { principalCV } from "@stacks/transactions/dist/clarity/types/principalCV";
import { pools } from "./components/preset-pools";

interface Args {
  /**
   * The address of the currently active account. Used to ensure users don't delegate to themselves,
   * which although technically possible, is most likely not what they want.
   */
  currentAccountAddress: string;

  networkName: StacksNetworkName;
}
export function createValidationSchema({
  currentAccountAddress,
  networkName,
}: Args) {
  return yup.object().shape({
    poolAddress: yup.string().when("poolName", {
      is: "Custom Pool",
      then: (schema) =>
        stxAddressSchema(schema, networkName).test({
          name: "cannot-pool-to-yourself",
          message: "Cannot pool to your own STX address",
          test(value) {
            return value !== currentAccountAddress;
          },
        }),
      otherwise: (schema) => schema.optional(),
    }),
    amount: stxAmountSchema()
      .test({
        name: "test-min-allowed-delegated-stacking",
        message: `You must delegate at least ${toHumanReadableStx(
          MIN_DELEGATED_STACKING_AMOUNT_USTX
        )}`,
        test(value) {
          if (value === undefined) return false;
          const enteredAmount = stxToMicroStx(value);
          return enteredAmount.isGreaterThanOrEqualTo(
            MIN_DELEGATED_STACKING_AMOUNT_USTX
          );
        },
      })
      .test({
        name: "test-max-allowed-delegated-stacking",
        message: `You cannot delegate more than ${toHumanReadableStx(
          UI_IMPOSED_MAX_STACKING_AMOUNT_USTX
        )}`,
        test(value) {
          if (value === undefined) return false;
          const enteredAmount = stxToMicroStx(value);
          return enteredAmount.isLessThanOrEqualTo(
            UI_IMPOSED_MAX_STACKING_AMOUNT_USTX
          );
        },
      }),
    delegationDurationType: yup
      .string()
      .required("Please select the delegation duration type."),
  });
}

function getOptions(
  values: EditingFormValues,
  poxInfo: PoxInfo,
  stackingContract: string,
  client: StackingClient
): ContractCallRegularOptions {
  const untilBurnBlockHeight =
    values.delegationDurationType === "limited"
      ? cyclesToBurnChainHeight({
          cycles: values.numberOfCycles,
          rewardCycleLength: poxInfo.reward_cycle_length,
          currentCycleId: poxInfo.current_cycle.id,
          firstBurnchainBlockHeight: poxInfo.first_burnchain_block_height,
        })
      : undefined;
  if (values.poolName === PoolName.CustomPool) {
    return client.getDelegateOptions(
      {
        contract: stackingContract,
        amountMicroStx: stxToMicroStx(values.amount).toString(),
        delegateTo: values.poolAddress,
        untilBurnBlockHeight,
      }
      // Type coercion necessary because the `network` property returned by
      // `client.getStackingContract()` has a wider type than allowed by `openContractCall`. Despite
      // the wider type, the actual value of `network` is always of the type `StacksNetwork`
      // expected by `openContractCall`.
      //
      // See
      // https://github.com/hirosystems/stacks.js/blob/0e1f9f19dfa45788236c9e481f9a476d9948d86d/packages/stacking/src/index.ts#L1054
    ) as ContractCallRegularOptions;
  } else {
    const pool = pools.find((p) => p.name === values.poolName);
    if (!pool) throw new Error("Invalid Pool Name");

    const [contractAddress, contractName] = pool.poxContract.split(".");
    const functionArgs =
      pool.poxContract === PoxContract.poxDelegation
        ? /* (amount-ustx uint) (delegate-to principal) (until-burn-ht (optional uint))
              (pool-pox-addr (optional (tuple (hashbytes (buff 32)) (version (buff 1)))))
              (user-pox-addr (tuple (hashbytes (buff 32)) (version (buff 1))))
              (lock-period uint)
              */
          [
            uintCV(stxToMicroStx(values.amount).toString()),
            principalCV(pool.poolAddress),
            untilBurnBlockHeight
              ? someCV(uintCV(untilBurnBlockHeight))
              : noneCV(),
            noneCV(),
            poxAddressToTuple(values.rewardAddress),
            uintCV(1),
          ]
        : pool.poxContract === PoxContract.fpDelegation
        ? [uintCV(stxToMicroStx(values.amount).toString())]
        : [];
    return {
      contractAddress,
      contractName,
      functionName: "delegate-stx",
      functionArgs,
    };
  }
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

    const delegateStxOptions = getOptions(
      values,
      poxInfo,
      stackingContract,
      client
    );

    console.log(delegateStxOptions);

    openContractCall({
      ...delegateStxOptions,
      onFinish() {
        setIsContractCallExtensionPageOpen(false);
        navigate("../pooled-stacking-info");
      },
      onCancel() {
        setIsContractCallExtensionPageOpen(false);
      },
    });
    setIsContractCallExtensionPageOpen(true);
  };
}
