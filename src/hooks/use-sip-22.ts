import { useStacksNetwork } from './use-stacks-network';

export function useSIP22() {
  const { networkName } = useStacksNetwork();
  const poxDisabled = networkName === 'mainnet';
  return { poxDisabled };
}
