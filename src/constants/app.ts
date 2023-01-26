import { stxToMicroStx } from '../utils/unit-convert';

function isValidNetValue(maybeNetwork: unknown): maybeNetwork is 'testnet' | 'mainnet' {
  return maybeNetwork === 'testnet' || maybeNetwork === 'mainnet';
}
if (!isValidNetValue(import.meta.env.VITE_STX_NETWORK))
  throw new Error('Invalid `VITE_STX_NETWORK` value provided.');
export const NETWORK: 'testnet' | 'mainnet' = import.meta.env.VITE_STX_NETWORK;

export const EXPLORER_URL = 'https://explorer.stacks.co';

export const STACKING_ADDRESS_FORMAT_HELP_URL =
  'https://www.hiro.so/questions/what-form-of-btc-addresses-can-i-use-for-proof-of-transfer-rewards';

export const STACKING_LEARN_MORE_URL = 'https://stacks.org/stacking-moves-us-forward';

export const STACKING_MINIMIUM_FOR_NEXT_CYCLE_URL =
  'https://stacking.club/cycles/next?tab=slot_minimum';

export const STACKING_CLUB_URL = 'https://stacking.club';

export const MAX_STACKING_CYCLES = 12;

export const MIN_STACKING_CYCLES = 1;

export const MIN_DELEGATED_STACKING_AMOUNT_USTX = 50_000_000;

export const UI_IMPOSED_MAX_STACKING_AMOUNT_USTX = stxToMicroStx(10_000_000_000);

export const STACKING_CONTRACT_CALL_TX_BYTES = 260;

export const SUPPORTED_BTC_ADDRESS_FORMATS = ['p2pkh', 'p2sh'] as const;

export const FEE_RATE = 400;

export const SEND_MANY_CONTACT_ID = 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.send-many-memo';
