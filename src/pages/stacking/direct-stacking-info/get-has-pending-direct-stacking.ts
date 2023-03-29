import { AccountsApi, TransactionsApi } from '@stacks/blockchain-api-client';
import { StackingClient, poxAddressToBtcAddress } from '@stacks/stacking';
import {
  ContractCallTransaction,
  ContractCallTransactionMetadata,
  MempoolContractCallTransaction,
  MempoolTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';
import { ClarityType, hexToCV } from '@stacks/transactions';

import { isContractCallTransaction, isMempoolContractCallTransaction } from '../utils/transactions';

function isStackCall(
  t: ContractCallTransactionMetadata,

  // Until PoX 2 has been fully activated, using this arg to determine the PoX contract id. Once
  // active, this value can be set to a constant.
  poxContractId: string
) {
  return (
    t.contract_call.function_name === 'stack-stx' && t.contract_call.contract_id === poxContractId
  );
}
/**
 * Given an array of transactions, ordered from most recent to least recent, returns the most recent
 * successful unanchored transaction calling the PoX's `stack-stx` function in a microblock.
 */
function findUnanchoredTransaction(
  transactions: Transaction[],
  // Until PoX 2 has been fully activated, using this arg to determine the PoX contract id. Once
  // active, this value can be set to a constant.
  poxContractId: string
): ContractCallTransaction | undefined {
  return transactions.find(t => {
    if (!isContractCallTransaction(t)) return false;
    if (!t.is_unanchored) return false;

    const transactionResultCV = hexToCV(t.tx_result.hex);
    const isOk = transactionResultCV.type === ClarityType.ResponseOk;
    return isOk && isStackCall(t, poxContractId);
  }) as ContractCallTransaction; // Casting as type is checked in `if` statement above.
}
/**
 * Given an array of transactions, ordered from most recent to least recent, returns the most recent
 * transaction calling the PoX's `stack-stx` function in the mempool.
 */
function findMempoolTransaction(
  transactions: MempoolTransaction[],
  // Until PoX 2 has been fully activated, using this arg to determine the PoX contract id. Once
  // active, this value can be set to a constant.
  poxContractId: string
) {
  return transactions.find(t => {
    if (!isMempoolContractCallTransaction(t)) return false;

    return isStackCall(t, poxContractId);
  }) as MempoolContractCallTransaction; // Casting as type is checked in `if` statement above.
}
export interface ReturnGetHasPendingDirectStacking {
  amountMicroStx: bigint;
  lockPeriod: bigint;
  poxAddress: string;
  transactionId: string;
  startBurnHeight: bigint;
}

// TODO: Types. For now assuming callers only provide a `stack-stx` pox call transaction.
function getDirectStackingStatusFromTransaction(
  transaction: ContractCallTransaction | MempoolContractCallTransaction,
  network: 'mainnet' | 'testnet'
): ReturnGetHasPendingDirectStacking {
  const args = transaction.contract_call.function_args;
  if (!args) {
    // TODO: log error
    throw new Error('Expected `args` to be defined.');
  }
  const [amountMicroStxCV, poxAddressCV, startBurnHeightCV, lockPeriodCV] = args.map(arg =>
    hexToCV(arg.hex)
  );

  // Start burn height
  if (!startBurnHeightCV || startBurnHeightCV.type !== ClarityType.UInt) {
    throw new Error('Expected `startBurnHeightCV` to be of type `UInt`.');
  }
  const startBurnHeight: bigint = startBurnHeightCV.value;

  // Amount
  if (!amountMicroStxCV || amountMicroStxCV.type !== ClarityType.UInt) {
    throw new Error('Expected `amountMicroStxCV` to be of type `UInt`.');
  }
  const amountMicroStx: bigint = amountMicroStxCV.value;

  // PoX address
  const poxAddress = poxAddressToBtcAddress(poxAddressCV, network);

  // Lock period
  if (!lockPeriodCV || lockPeriodCV.type !== ClarityType.UInt) {
    throw new Error('Expected `lockPeriodCV` to be of type `UInt`.');
  }
  const lockPeriod = lockPeriodCV.value;

  return {
    transactionId: transaction.tx_id,
    startBurnHeight,
    amountMicroStx,
    poxAddress,
    lockPeriod,
  };
}

interface Args {
  stackingClient: StackingClient;
  accountsApi: AccountsApi;
  address: string;
  transactionsApi: TransactionsApi;
  network: 'mainnet' | 'testnet';
}

export async function getHasPendingDirectStacking({
  stackingClient,
  accountsApi,
  address,
  transactionsApi,
  network,
}: Args): Promise<null | ReturnGetHasPendingDirectStacking> {
  const [contractPrincipal, accountTransactions, mempoolTransactions] = await Promise.all([
    stackingClient.getStackingContract(),
    accountsApi.getAccountTransactions({
      principal: address,
      unanchored: true,
      limit: 50,
    }),
    transactionsApi.getAddressMempoolTransactions({
      address,
      unanchored: true,
    }),
  ]);

  // NOTE: `results` needs to be cast due to known issues with types,
  // https://github.com/hirosystems/stacks-blockchain-api/tree/master/client#known-issues
  const accountTransaction = findUnanchoredTransaction(
    accountTransactions.results as Transaction[],
    contractPrincipal
  );
  const mempoolTransaction = findMempoolTransaction(
    mempoolTransactions.results as MempoolTransaction[],
    contractPrincipal
  );

  let transaction: undefined | ContractCallTransaction | MempoolContractCallTransaction;
  if (!accountTransaction && mempoolTransaction) {
    transaction = mempoolTransaction;
  } else if (accountTransaction && !mempoolTransaction) {
    transaction = accountTransaction;
  } else if (accountTransaction && mempoolTransaction) {
    transaction =
      accountTransaction.nonce > mempoolTransaction.nonce ? accountTransaction : mempoolTransaction;
  }

  if (transaction) {
    return getDirectStackingStatusFromTransaction(transaction, network);
  }

  return null;
}
