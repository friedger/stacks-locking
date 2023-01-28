import { AccountsApi, TransactionsApi } from "@stacks/blockchain-api-client";
import { StackingClient, poxAddressToBtcAddress } from "@stacks/stacking";
import { ClarityType, hexToCV } from "@stacks/transactions";

/**
 * Given an array of transactions, ordered from most recent to least recent, returns the most recent
 * successful transaction calling the PoX's `stack-stx` function. Mempool transactions are assumed
 * to be successful.
 */
function getMostRecentSuccessfulStackStxTransaction(
  transactions: any[],
  // Until PoX 2 has been fully activated, using this arg to determine the PoX contract id. Once
  // active, this value can be set to a constant.
  poxContractId: string
) {
  return transactions.find((t: any) => {
    // For transactions in microblock

    let isSuccess = false;
    if (t.tx_result?.hex) {
      const isSuccessCV = hexToCV(t.tx_result?.hex);
      isSuccess = isSuccessCV.type === ClarityType.ResponseOk;
    }

    // For transactions in mempool
    const isPending = t.tx_status === "pending";

    const isCallToPoxStackStx =
      t.contract_call?.function_name === "stack-stx" &&
      t.contract_call?.contract_id === poxContractId;
    return (isSuccess || isPending) && isCallToPoxStackStx;
  });
}

interface ReturnGetHasPendingDirectStacking {
  amountMicroStx: bigint;
  lockPeriod: number;
  poxAddress: string;
  transactionId: string;
}

// TODO: Types. For now assuming callers only provide a `stack-stx` pox call transaction.
function getDirectStackingStatusFromTransaction(
  transaction: any,
  network: "mainnet" | "testnet"
): ReturnGetHasPendingDirectStacking {
  const [amountMicroStxCV, poxAddressCV, startBurnHeightCV, lockPeriodCV] =
    transaction.contract_call.function_args.map((arg: any) => hexToCV(arg.hex));

  // Start burn height
  let startBurnHeight: null | bigint = null;
  if (startBurnHeightCV.type === ClarityType.UInt) {
    startBurnHeight = startBurnHeightCV.value;
  }

  // Amount
  if (!amountMicroStxCV || amountMicroStxCV.type !== ClarityType.UInt) {
    throw new Error("Expected `amount-ustx` to be defined.");
  }
  const amountMicroStx: bigint = amountMicroStxCV.value;

  // PoX address
  const poxAddress = poxAddressToBtcAddress(poxAddressCV, network);

  // Lock period
  const lockPeriod = lockPeriodCV.value;

  return {
    transactionId: transaction.tx_id,
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
  network: "mainnet" | "testnet";
}

export async function getHasPendingDirectStacking({
  stackingClient,
  accountsApi,
  address,
  transactionsApi,
  network,
}: Args): Promise<null | ReturnGetHasPendingDirectStacking> {
  const [contractPrincipal, accountTransactions, mempoolTransactions] =
    await Promise.all([
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

  const accountTransaction = getMostRecentSuccessfulStackStxTransaction(
    accountTransactions.results,
    contractPrincipal
  );
  const mempoolTransaction = getMostRecentSuccessfulStackStxTransaction(
    mempoolTransactions.results,
    contractPrincipal
  );

  let transaction = null;
  if (!accountTransaction) {
    transaction = mempoolTransaction;
  } else if (!mempoolTransaction) {
    transaction = accountTransaction;
  } else {
    transaction =
      accountTransaction.nonce > mempoolTransaction.nonce
        ? accountTransaction
        : mempoolTransaction;
  }

  if (transaction) {
    return getDirectStackingStatusFromTransaction(transaction, network);
  }

  return null;
}
