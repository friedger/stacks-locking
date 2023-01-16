import { AccountsApi, SmartContractsApi, TransactionsApi } from '@stacks/blockchain-api-client';
import { StackingClient } from '@stacks/stacking';
import {
  cvToHex,
  tupleCV,
  standardPrincipalCV,
  hexToCV,
  ClarityType,
  cvToString,
  ClarityValue,
} from '@stacks/transactions';

function getLastSuccessfulDelegationTransaction(transactions: any[]) {
  return transactions.find((t: any) => {
    // For transactions in microblock
    const isUnanchored = t.is_unanchored === true;
    const isSuccess = t.tx_result?.repr === '(ok true)';

    // For transactions in mempool
    const isPending = t.tx_status === 'pending';

    const isDelegateStxOrRevokeDelegateStx = ['delegate-stx', 'revoke-delegate-stx'].includes(
      t.contract_call?.function_name
    );
    return ((isUnanchored && isSuccess) || isPending) && isDelegateStxOrRevokeDelegateStx;
  });
}

function getDelegationStatusFromTransaction(transaction: any, burnBlockHeight: number) {
  if (transaction.contract_call.function_name === 'revoke-delegate-stx') {
    return { isDelegating: false } as const;
  } else {
    const [amountMicroStxCV, delegatedToCV, untilBurnHeightCV, _poxAddressCV] =
      transaction.contract_call.function_args.map((arg: any) => hexToCV(arg.hex));
    let untilBurnHeight = null;
    if (
      untilBurnHeightCV.type === ClarityType.OptionalSome &&
      untilBurnHeightCV.value.type === ClarityType.UInt
    ) {
      untilBurnHeight = untilBurnHeightCV.value.value;
    }

    const isExpired = untilBurnHeight !== null && burnBlockHeight > untilBurnHeight;

    if (!amountMicroStxCV || amountMicroStxCV.type !== ClarityType.UInt) {
      throw new Error('Expected `amount-ustx` to be defined.');
    }
    const amountMicroStx = amountMicroStxCV.value;

    if (!delegatedToCV || delegatedToCV.type !== ClarityType.PrincipalStandard) {
      throw new Error('Expected `amount-ustx` to be defined.');
    }
    const delegatedTo = cvToString(delegatedToCV);

    return {
      isDelegating: true,
      isExpired,
      amountMicroStx,
      delegatedTo,
      untilBurnHeight,
    } as const;
  }
}

function getDelegationStatusFromMapEntry(mapEntryCV: ClarityValue, burnBlockHeight: number) {
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
    tupleCVData['delegated-to'].type !== ClarityType.PrincipalStandard
  ) {
    throw new Error('Expected `amount-ustx` to be defined.');
  }
  const delegatedTo = cvToString(tupleCVData['delegated-to']);

  return {
    isDelegating: true,
    isExpired,
    amountMicroStx,
    delegatedTo,
    untilBurnHeight,
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

  // https://docs.hiro.so/api#tag/Smart-Contracts/operation/get_contract_data_map_entry
  const args = {
    contractAddress,
    contractName,
    key,
    mapName: 'delegation-state',
  };
  const res = await smartContractsApi.getContractDataMapEntry(args);
  return hexToCV(res.data);
}

interface Args {
  stackingClient: StackingClient;
  accountsApi: AccountsApi;
  smartContractsApi: SmartContractsApi;
  address: string;
  transactionsApi: TransactionsApi;
}
export async function getDelegationStatus({
  stackingClient,
  accountsApi,
  address,
  smartContractsApi,
  transactionsApi,
}: Args) {
  const [contractPrincipal, coreInfo, accountTransactions, mempoolTransactions] = await Promise.all(
    [
      stackingClient.getStackingContract(),
      stackingClient.getCoreInfo(),
      accountsApi.getAccountTransactions({
        principal: address,
        unanchored: true,
        limit: 50,
      }),
      transactionsApi.getAddressMempoolTransactions({
        address,
        unanchored: true,
      }),
    ]
  );

  const accountTransaction = getLastSuccessfulDelegationTransaction(accountTransactions.results);
  const mempoolTransaction = getLastSuccessfulDelegationTransaction(mempoolTransactions.results);

  let transaction = null;
  if (!accountTransaction) {
    transaction = mempoolTransaction;
  } else if (!mempoolTransaction) {
    transaction = accountTransaction;
  } else {
    transaction =
      accountTransaction.nonce > mempoolTransaction.nonce ? accountTransaction : mempoolTransaction;
  }

  if (transaction) {
    return getDelegationStatusFromTransaction(transaction, coreInfo.burn_block_height);
  }

  const mapEntryCV = await getOnChainPoxDelegationMapEntryCV({
    address,
    contractPrincipal,
    smartContractsApi,
  });

  return getDelegationStatusFromMapEntry(mapEntryCV, coreInfo.burn_block_height);
}
