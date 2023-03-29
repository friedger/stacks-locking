import { Text, color } from '@stacks/ui';

import { initialNetworkName } from './network-provider';

export function NetworkInfo() {
  if (initialNetworkName === 'mainnet') {
    return null;
  }
  return (
    <Text color={color('text-caption')}>
      {initialNetworkName === 'testnet' ? 'Testnet' : 'Devnet'}
    </Text>
  );
}
