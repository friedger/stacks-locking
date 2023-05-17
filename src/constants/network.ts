import { StacksNetworkName } from '@stacks/network';
import { ChainID } from '@stacks/transactions';

import {
  DEFAULT_DEVNET_SERVER,
  DEFAULT_MAINNET_SERVER,
  DEFAULT_TESTNET_SERVER,
} from '../constants';

export const NetworkIdModeMap: { [key in ChainID]: StacksNetworkName } = {
  [ChainID.Mainnet]: 'mainnet',
  [ChainID.Testnet]: 'testnet',
};

export const NetworkModeUrlMap: Record<StacksNetworkName, string> = {
  mainnet: DEFAULT_MAINNET_SERVER,
  testnet: DEFAULT_TESTNET_SERVER,
  devnet: DEFAULT_DEVNET_SERVER,
  mocknet: DEFAULT_DEVNET_SERVER,
};

export const CustomNetworksLSKey = 'CustomNetworks';
