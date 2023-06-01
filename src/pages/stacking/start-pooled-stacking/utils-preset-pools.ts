import { ChainID } from '@stacks/common';
import { StacksNetwork } from '@stacks/network';
import { DEFAULT_DEVNET_SERVER } from 'src/constants';

import { pools } from './components/preset-pools';
import {
  NetworkInstance,
  NetworkInstanceToPoxContractMap,
  Pool,
  PoolName,
  PoxContractName,
  PoxContractType,
  WrapperPrincipal,
} from './types-preset-pools';

export function getNetworkInstance(network: StacksNetwork) {
  if (network.chainId === ChainID.Mainnet) {
    return NetworkInstance.mainnet;
  } else if (network.coreApiUrl === DEFAULT_DEVNET_SERVER) {
    return NetworkInstance.devnet;
  } else {
    return NetworkInstance.testnet;
  }
}

export function getPox3Contracts(network: StacksNetwork): PoxContractType {
  const mode = getNetworkInstance(network);
  return NetworkInstanceToPoxContractMap[mode];
}

export function usesPoxWrapperContract(pool: Pool) {
  return pool.poxContract !== PoxContractName.Pox3;
}

export function requiresAllowContractCaller(poolName: PoolName) {
  if (poolName === PoolName.CustomPool) return false;
  const pool = pools[poolName];
  return usesPoxWrapperContract(pool);
}

export function getPoxWrapperContract(
  poolName: PoolName,
  network: StacksNetwork
): WrapperPrincipal {
  return getPox3Contracts(network)[pools[poolName].poxContract];
}

export function getPoxWrapperContract2(
  networkInstance: NetworkInstance,
  poxContractName: PoxContractName
): WrapperPrincipal {
  return NetworkInstanceToPoxContractMap[networkInstance][poxContractName];
}

export function isSelfServicePool(poolAddress: string) {
  const allSelfServicePools: string[] = [
    NetworkInstanceToPoxContractMap[NetworkInstance.mainnet][PoxContractName.WrapperFastPool],
    NetworkInstanceToPoxContractMap[NetworkInstance.testnet][PoxContractName.WrapperFastPool],
    NetworkInstanceToPoxContractMap[NetworkInstance.devnet][PoxContractName.WrapperFastPool],
  ];
  return allSelfServicePools.includes(poolAddress);
}

export function getPoxContractAddressAndName(
  networkInstance: NetworkInstance,
  poxContract: PoxContractName
) {
  return NetworkInstanceToPoxContractMap[networkInstance][poxContract].split('.');
}
