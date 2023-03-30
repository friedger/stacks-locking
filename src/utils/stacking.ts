import { sha256 } from '@noble/hashes/sha256';
import { base58check } from '@scure/base';
import { poxAddressToBtcAddress } from '@stacks/stacking';
import { AddressHashMode } from '@stacks/transactions';
import BN from 'bn.js';
import { Buffer } from 'buffer';

import { NETWORK } from '@constants/app';

// TODO: Can't figure out the right types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const poxKeyToVersionBytesMap: Record<'mainnet' | 'testnet', any> = {
  mainnet: {
    [AddressHashMode.SerializeP2PKH]: 0x00,
    [AddressHashMode.SerializeP2SH]: 0x05,
  },
  testnet: {
    [AddressHashMode.SerializeP2PKH]: 0x6f,
    [AddressHashMode.SerializeP2SH]: 0xc4,
  },
};

interface ConvertToPoxAddressBtc {
  version: Uint8Array;
  hashbytes: Uint8Array;
}
export function convertPoxAddressToBtc(network: 'mainnet' | 'testnet') {
  return ({ version, hashbytes }: ConvertToPoxAddressBtc) => {
    return poxAddressToBtcAddress(version[0], hashbytes, network);
  };
}

export const formatPoxAddressToNetwork = convertPoxAddressToBtc(NETWORK);

export function formatCycles(cycles: number) {
  return `${cycles} cycle${cycles !== 1 ? 's' : ''}`;
}
