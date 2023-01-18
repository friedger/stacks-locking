import { ReactNode, createContext, useContext } from 'react';

import { useAuth } from '@components/auth-provider/auth-provider';
import { StackingClient } from '@stacks/stacking';
import { validateStacksAddress as isValidStacksAddress } from '@stacks/transactions';
import { useQuery } from '@tanstack/react-query';
import { useNetwork } from '@components/network-provider';

interface StackingClientContext {
  client: null | StackingClient;
}
const StackingClientContext = createContext<StackingClientContext>({ client: null });

interface Props {
  children: ReactNode;
}
export function StackingClientProvider({ children }: Props) {
  const { address } = useAuth();
  const { network } = useNetwork();

  let client: StackingClient | null = null;

  if (address !== null && isValidStacksAddress(address)) {
    client = new StackingClient(address, network);
  }

  return (
    <>
      <StackingClientContext.Provider value={{ client }}>{children}</StackingClientContext.Provider>
    </>
  );
}

export function useStackingClient() {
  return useContext(StackingClientContext);
}

export function useGetStatusQuery() {
  const { client } = useStackingClient();
  return useQuery(['getStatus'], () => client?.getStatus());
}

export function useGetAccountBalanceLocked() {
  const { client } = useStackingClient();
  return useQuery(['getAccountBalanceLocked'], () => client?.getAccountBalanceLocked());
}

export function useGetCoreInfoQuery() {
  const { client } = useStackingClient();
  return useQuery(['getCoreInfo'], () => client?.getCoreInfo());
}

export function useGetAccountExtendedBalancesQuery() {
  const { client } = useStackingClient();
  return useQuery(['getAccountExtendedBalances'], () => client?.getAccountExtendedBalances());
}

export function useGetSecondsUntilNextCycleQuery() {
  const { client } = useStackingClient();
  return useQuery(['getSecondsUntilNextCycle'], () => client?.getSecondsUntilNextCycle(), {
    refetchInterval: 60_000,
  });
}

export function useGetPoxInfoQuery() {
  const { client } = useStackingClient();
  return useQuery(['getPoxInfo'], () => client?.getPoxInfo());
}
