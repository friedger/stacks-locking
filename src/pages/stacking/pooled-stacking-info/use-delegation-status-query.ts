import { useAuth } from '@components/auth-provider/auth-provider';
import { useStackingClient } from '@components/stacking-client-provider/stacking-client-provider';
import { NETWORK } from '@constants/index';
import { SmartContractsApi, Configuration, AccountsApi } from '@stacks/blockchain-api-client';
import {
  cvToHex,
  tupleCV,
  standardPrincipalCV,
  hexToCV,
  ClarityType,
  cvToString,
} from '@stacks/transactions';
import { useQuery } from '@tanstack/react-query';

// NOTE: the package `@stacks/stacking` does not yet provide a way to read the
// PoX contract's delegation map. Therefore, this data must be fetched by other
// means. In this case, using `@stacks/blockchain-api-client`.
const basePath =
  NETWORK === 'testnet'
    ? 'https://stacks-node-api.testnet.stacks.co'
    : 'https://stacks-node-api.mainnet.stacks.co';
const config = new Configuration({ basePath });
const smartContractsApi = new SmartContractsApi(config);
const accountsApi = new AccountsApi(config);

export function useDelegationStatusQuery() {
  const { client } = useStackingClient();
  const { address } = useAuth();
  if (!client) {
    // TODO: report error
    throw new Error('Expected to have a StackingClient available in the context.');
  }

  if (!address) {
    // TODO: report error
    throw new Error('Expected `address` to be defined.');
  }

  return useQuery(
    ['delegation-status'],
    async () => {
      const [stackingContract, coreInfo, transactions] = await Promise.all([
        client.getStackingContract(),
        client.getCoreInfo(),
        accountsApi.getAccountTransactions({
          principal: address,
          unanchored: true,
          limit: 50,
        }),
      ]);
      const key = cvToHex(tupleCV({ stacker: standardPrincipalCV(client.address) }));
      const [contractAddress, contractName] = stackingContract.split('.');

      // https://docs.hiro.so/api#tag/Smart-Contracts/operation/get_contract_data_map_entry
      const args = {
        contractAddress,
        contractName,
        key,
        mapName: 'delegation-state',
      };
      const res = await smartContractsApi.getContractDataMapEntry(args);
      const dataCV = hexToCV(res.data);

      if (dataCV.type === ClarityType.OptionalNone) {
        return { isDelegating: false } as const;
      }

      if (dataCV.type !== ClarityType.OptionalSome || dataCV.value.type !== ClarityType.Tuple) {
        // TODO: report error
        throw new Error('Expected to receive an `OptionalSome` value containing a `Tuple`.');
      }

      const tupleCVData = dataCV.value.data;

      let untilBurnHeight = null;
      if (
        tupleCVData['until-burn-ht'] &&
        tupleCVData['until-burn-ht'].type === ClarityType.OptionalSome &&
        tupleCVData['until-burn-ht'].value.type === ClarityType.UInt
      ) {
        untilBurnHeight = tupleCVData['until-burn-ht'].value.value;
      }
      const isExpired = untilBurnHeight !== null && coreInfo.burn_block_height > untilBurnHeight;

      if (!tupleCVData['amount-ustx'] || tupleCVData['amount-ustx'].type !== ClarityType.UInt) {
        // TODO: report error
        throw new Error('Expected `amount-ustx` to be defined.');
      }
      const amountMicroStx = tupleCVData['amount-ustx'].value;

      if (
        !tupleCVData['delegated-to'] ||
        tupleCVData['delegated-to'].type !== ClarityType.PrincipalStandard
      ) {
        // TODO: report error
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
    },
    { refetchInterval: 2000 }
  );
}
