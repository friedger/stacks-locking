import { AccountsApi, SmartContractsApi, TransactionsApi } from '@stacks/blockchain-api-client';
import { StacksNetwork } from '@stacks/network';
import {
  DelegationInfo,
  StackingClient,
  extractPoxAddressFromClarityValue,
} from '@stacks/stacking';
import {
  ContractCallTransaction,
  ContractCallTransactionMetadata,
  MempoolContractCallTransaction,
} from '@stacks/stacks-blockchain-api-types';
import { ClarityType, ClarityValue, cvToString, hexToCV } from '@stacks/transactions';

import { getHasPendingTransaction } from '../direct-stacking-info/utils-pending-txs';
import { PoxContractName } from '../start-pooled-stacking/types-preset-pools';
import { getPox3Contracts } from '../start-pooled-stacking/utils-preset-pools';

function isDelegateOrRevokeDelegate(t: ContractCallTransactionMetadata) {
  return ['delegate-stx', 'revoke-delegate-stx'].includes(t.contract_call.function_name);
}

function safeDelegateToCVToString(clarityValue: ClarityValue | undefined) {
  if (
    !clarityValue ||
    (clarityValue.type !== ClarityType.PrincipalStandard &&
      clarityValue.type !== ClarityType.PrincipalContract)
  ) {
    throw new Error('Expected `delegate-to` to be defined.');
  }
  return cvToString(clarityValue);
}

function getDelegationStatusFromTransaction(network: StacksNetwork) {
  return (
    transaction: ContractCallTransaction | MempoolContractCallTransaction
  ): DelegationInfo => {
    const pox3Contracts = getPox3Contracts(network);

    if (transaction.contract_call.function_name === 'revoke-delegate-stx') {
      return { delegated: false } as const;
    }

    if (transaction.contract_call.function_name === 'delegate-stx') {
      const args = transaction.contract_call.function_args;
      if (!Array.isArray(args)) {
        console.error('Detected a non-standard delegate-stx transaction.');
        return { delegated: false } as const;
      }

      const [amountMicroStxCV, delegatedToCV, untilBurnHeightCV, poxAddressCV] = args.map<
        // The values above should be partially defined as long as the clarity contract
        // and the api follows the PoX pattern. They can be undefined.
        ClarityValue | undefined
      >(arg => hexToCV(arg.hex));

      if (!amountMicroStxCV || amountMicroStxCV.type !== ClarityType.UInt) {
        throw new Error('Expected `amount-ustx` to be defined.');
      }
      const amountMicroStx: bigint = amountMicroStxCV.value;

      let untilBurnHeight: undefined | number = undefined;

      if (
        transaction.contract_call.contract_id === pox3Contracts[PoxContractName.WrapperFastPool]
      ) {
        untilBurnHeight = undefined;
      } else {
        if (
          untilBurnHeightCV &&
          untilBurnHeightCV.type === ClarityType.OptionalSome &&
          untilBurnHeightCV.value.type === ClarityType.UInt
        ) {
          untilBurnHeight = Number(untilBurnHeightCV.value.value);
        }
      }

      const delegatedTo =
        transaction.contract_call.contract_id === pox3Contracts[PoxContractName.WrapperFastPool]
          ? pox3Contracts[PoxContractName.WrapperFastPool]
          : safeDelegateToCVToString(delegatedToCV);

      const extractPoxAddressFromClarityValue2 = (poxAddrCV: ClarityValue) => {
        const { version, hashBytes } = extractPoxAddressFromClarityValue(poxAddrCV);
        return { version: new Uint8Array([version]), hashbytes: hashBytes };
      };

      const poxAddress =
        poxAddressCV !== undefined ? extractPoxAddressFromClarityValue2(poxAddressCV) : undefined;

      return {
        delegated: true,
        details: {
          amount_micro_stx: amountMicroStx,
          delegated_to: delegatedTo,
          until_burn_ht: untilBurnHeight,
          pox_address: poxAddress,
        },
      } as const;
    }

    // TODO: log error
    console.error(
      'Processed a non-delegation transaction. Only delegation-related transaction should be used with this function.'
    );
    return { delegated: false } as const;
  };
}

interface Args {
  stackingClient: StackingClient;
  accountsApi: AccountsApi;
  smartContractsApi: SmartContractsApi;
  address: string;
  transactionsApi: TransactionsApi;
  network: StacksNetwork;
}
export async function getDelegationStatus({
  stackingClient,
  accountsApi,
  address,
  transactionsApi,
  network,
}: Args): Promise<DelegationInfo> {
  const delegationStatus = await getHasPendingTransaction({
    stackingClient,
    accountsApi,
    address,
    transactionsApi,
    transactionConverter: getDelegationStatusFromTransaction(network),
    transactionPredicate: isDelegateOrRevokeDelegate,
  });
  if (delegationStatus !== null) {
    return delegationStatus;
  }
  return stackingClient.getDelegationStatus();
}
