import { AccountsApi, SmartContractsApi, TransactionsApi } from '@stacks/blockchain-api-client';
import { StacksNetwork } from '@stacks/network';
import { StackingClient } from '@stacks/stacking';
import {
  ContractCallTransaction,
  ContractCallTransactionMetadata,
  MempoolContractCallTransaction,
} from '@stacks/stacks-blockchain-api-types';
import {
  ClarityType,
  ClarityValue,
  cvToHex,
  cvToString,
  hexToCV,
  standardPrincipalCV,
  tupleCV,
} from '@stacks/transactions';

import { getHasPendingTransaction } from '../direct-stacking-info/utils-pending-txs';
import { PoxContractName } from '../start-pooled-stacking/types-preset-pools';
import { getPox2Contracts } from '../start-pooled-stacking/utils-preset-pools';

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

function getDelegationStatusFromTransaction(burnBlockHeight: number, network: StacksNetwork) {
  return (
    transaction: ContractCallTransaction | MempoolContractCallTransaction
  ): DelegationStatus => {
    const pox2Contracts = getPox2Contracts(network);

    if (transaction.contract_call.function_name === 'revoke-delegate-stx') {
      return { isDelegating: false } as const;
    }

    if (transaction.contract_call.function_name === 'delegate-stx') {
      const args = transaction.contract_call.function_args;
      if (!Array.isArray(args)) {
        // TODO: log error
        console.error('Detected a non-standard delegate-stx transaction.');
        return { isDelegating: false } as const;
      }

      const [amountMicroStxCV, delegatedToCV, untilBurnHeightCV] = args.map<
        // The values above should be partially defined as long as the clarity contract
        // and the api follows the PoX pattern. They can be undefined.
        ClarityValue | undefined
      >(arg => hexToCV(arg.hex));

      if (!amountMicroStxCV || amountMicroStxCV.type !== ClarityType.UInt) {
        throw new Error('Expected `amount-ustx` to be defined.');
      }
      const amountMicroStx: bigint = amountMicroStxCV.value;

      let untilBurnHeight: null | bigint = null;

      if (
        transaction.contract_call.contract_id === pox2Contracts[PoxContractName.WrapperFastPool]
      ) {
        untilBurnHeight = null;
      } else {
        if (
          untilBurnHeightCV &&
          untilBurnHeightCV.type === ClarityType.OptionalSome &&
          untilBurnHeightCV.value.type === ClarityType.UInt
        ) {
          untilBurnHeight = untilBurnHeightCV.value.value;
        }
      }

      const isExpired = untilBurnHeight !== null && burnBlockHeight > untilBurnHeight;

      const delegatedTo =
        transaction.contract_call.contract_id === pox2Contracts[PoxContractName.WrapperFastPool]
          ? pox2Contracts[PoxContractName.WrapperFastPool]
          : safeDelegateToCVToString(delegatedToCV);

      return {
        isDelegating: true,
        details: {
          isExpired,
          amountMicroStx,
          delegatedTo,
          untilBurnHeight,
        },
      } as const;
    }

    // TODO: log error
    console.error(
      'Processed a non-delegation transaction. Only delegation-related transaction should be used with this function.'
    );
    return { isDelegating: false } as const;
  };
}

function getDelegationStatusFromMapEntry(
  mapEntryCV: ClarityValue,
  burnBlockHeight: number
): DelegationStatus {
  if (mapEntryCV.type === ClarityType.OptionalNone) {
    return { isDelegating: false } as const;
  }

  if (mapEntryCV.type !== ClarityType.OptionalSome || mapEntryCV.value.type !== ClarityType.Tuple) {
    throw new Error('Expected to receive an `OptionalSome` value containing a `Tuple`.');
  }

  const tupleCVData = mapEntryCV.value.data;

  let untilBurnHeight = null;
  if (
    tupleCVData['until-burn-ht'] &&
    tupleCVData['until-burn-ht'].type === ClarityType.OptionalSome &&
    tupleCVData['until-burn-ht'].value.type === ClarityType.UInt
  ) {
    untilBurnHeight = tupleCVData['until-burn-ht'].value.value;
  }
  const isExpired = untilBurnHeight !== null && burnBlockHeight > untilBurnHeight;

  if (!tupleCVData['amount-ustx'] || tupleCVData['amount-ustx'].type !== ClarityType.UInt) {
    throw new Error('Expected `amount-ustx` to be defined.');
  }
  const amountMicroStx = tupleCVData['amount-ustx'].value;

  if (
    !tupleCVData['delegated-to'] ||
    (tupleCVData['delegated-to'].type !== ClarityType.PrincipalStandard &&
      tupleCVData['delegated-to'].type !== ClarityType.PrincipalContract)
  ) {
    throw new Error('Expected `delegated-to` to be defined.');
  }
  const delegatedTo = cvToString(tupleCVData['delegated-to']);

  return {
    isDelegating: true,
    details: {
      isExpired,
      amountMicroStx,
      delegatedTo,
      untilBurnHeight,
    },
  } as const;
}

interface GetOnChainPoxDelegationMapEntryCVArgs {
  address: string;
  contractPrincipal: string;
  smartContractsApi: SmartContractsApi;
}
async function getOnChainPoxDelegationMapEntryCV({
  address,
  contractPrincipal,
  smartContractsApi,
}: GetOnChainPoxDelegationMapEntryCVArgs) {
  const key = cvToHex(tupleCV({ stacker: standardPrincipalCV(address) }));
  const [contractAddress, contractName] = contractPrincipal.split('.');

  const args = {
    contractAddress,
    contractName,
    key,
    mapName: 'delegation-state',
  };
  const res = await smartContractsApi.getContractDataMapEntry(args);
  return hexToCV(res.data);
}

export type DelegationStatus =
  | { isDelegating: false }
  | {
      isDelegating: true;
      details: {
        isExpired: boolean;
        amountMicroStx: bigint;
        delegatedTo: string;
        untilBurnHeight: bigint | null;
      };
    };

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
  smartContractsApi,
  transactionsApi,
  network,
}: Args): Promise<DelegationStatus> {
  const [poxStackingContract, coreInfo] = await Promise.all([
    stackingClient.getStackingContract(),
    stackingClient.getCoreInfo(),
  ]);
  const delegationStatus = await getHasPendingTransaction({
    stackingClient,
    accountsApi,
    address,
    transactionsApi,
    transactionConverter: getDelegationStatusFromTransaction(coreInfo.burn_block_height, network),
    transactionPredicate: isDelegateOrRevokeDelegate,
  });
  if (delegationStatus !== null) {
    return delegationStatus;
  }

  const mapEntryCV = await getOnChainPoxDelegationMapEntryCV({
    address,
    contractPrincipal: poxStackingContract,
    smartContractsApi,
  });

  return getDelegationStatusFromMapEntry(mapEntryCV, coreInfo.burn_block_height);
}
