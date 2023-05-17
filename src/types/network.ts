import { StacksNetworkName } from '@stacks/network';
import { ChainID } from '@stacks/transactions';

export interface Network {
  label: string;
  url: string;
  networkId: ChainID;
  mode: StacksNetworkName;
  wsUrl?: string;
  isCustomNetwork?: boolean;
}

interface WhenStacksChainIdMap<T> {
  [ChainID.Mainnet]: T;
  [ChainID.Testnet]: T;
}
export function whenStacksChainId(chainId: ChainID) {
  return <T>(chainIdMap: WhenStacksChainIdMap<T>): T => chainIdMap[chainId];
}
interface WhenStacksModeMap<T> {
  mainnet: T;
  testnet: T;
  regtest: T;
}
export function whenStacksNetworkMode(mode: StacksNetworkName) {
  return <T>(modeMap: WhenStacksModeMap<T>): T => modeMap[mode];
}
