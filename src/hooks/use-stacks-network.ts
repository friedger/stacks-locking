import {
  StacksDevnet,
  StacksMainnet,
  StacksMocknet,
  StacksNetworkName,
  StacksTestnet,
} from '@stacks/network';
import { NetworkInstance } from 'src/pages/stacking/start-pooled-stacking/types-preset-pools';
import { getNetworkInstance } from 'src/pages/stacking/start-pooled-stacking/utils-preset-pools';
import { whenStacksNetworkMode } from 'src/types/network';

import { fetchWithApiKey } from '@utils/fetch-with-api-keys';

import { useGlobalContext } from '../context/use-app-context';

export const useStacksNetwork = (): {
  network: StacksTestnet | StacksMainnet;
  networkName: StacksNetworkName;
  networkInstance: NetworkInstance;
  networkLabel: string;
} => {
  const selectedNetwork = useGlobalContext().activeNetwork;
  const apiServer = selectedNetwork.url;
  const networkMode = selectedNetwork.mode;
  const Network = whenStacksNetworkMode(networkMode)({
    mainnet: StacksMainnet,
    testnet: StacksTestnet,
    devnet: StacksDevnet,
    mocknet: StacksMocknet,
  });
  const network = new Network({ url: apiServer, fetchFn: fetchWithApiKey });
  const networkInstance = getNetworkInstance(network);
  return {
    network,
    networkName: networkMode as StacksNetworkName,
    networkInstance,
    networkLabel: selectedNetwork.label,
  };
};
