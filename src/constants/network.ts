import { StacksNetworkName } from '@stacks/network';
import { ChainID } from '@stacks/transactions';

import { DEFAULT_MAINNET_SERVER, DEFAULT_TESTNET_SERVER } from '../constants';

export const NetworkIdModeMap: { [key in ChainID]: StacksNetworkName } = {
  [ChainID.Mainnet]: 'mainnet',
  [ChainID.Testnet]: 'testnet',
};

export const NetworkModeUrlMap: Record<StacksNetworkName, string> = {
  mainnet: DEFAULT_MAINNET_SERVER,
  testnet: DEFAULT_TESTNET_SERVER,
};

export const CustomNetworksLSKey = 'CustomNetworks';
