import { NETWORK } from '@constants/app';
import {
  StacksTestnet,
  StacksMainnet,
  /* StacksMocknet, */ StacksNetwork,
  StacksNetworkName,
} from '@stacks/network';
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';
import { ErrorAlert } from './error-alert';

const Context = createContext<{
  network: StacksNetwork;
  setNetworkByName: Dispatch<SetStateAction<StacksNetworkName>>;
  networkName: StacksNetworkName;
  /* setCustomNetwork: Dispatch<SetStateAction<StacksNetwork | null>>; */
}>(null!);

interface Props {
  children: ReactNode;
}
export function NetworkProvider({ children }: Props) {
  const [networkName, setNetworkByName] = useState<StacksNetworkName>(NETWORK ?? 'testnet');
  /* const [customNetwork, setCustomNetwork] = useState<StacksMocknet | null>(null); */

  let network: StacksNetwork;
  if (networkName === 'mainnet') {
    network = new StacksMainnet();
  } else if (networkName === 'testnet') {
    network = new StacksTestnet();
  } else if (NETWORK === 'mainnet') {
    network = new StacksMainnet();
  } else if (NETWORK === 'testnet') {
    network = new StacksTestnet();
  } else {
    const msg = 'Unable to set up network to use for the app.';
    const id = '4e7eb9d7-1610-4b5e-be95-79d3dea3e670';
    return <ErrorAlert id={id}>{msg}</ErrorAlert>;
  }

  return (
    <Context.Provider value={{ network, setNetworkByName, networkName /* setCustomNetwork */ }}>
      {children}
    </Context.Provider>
  );
}

export function useNetwork() {
  return useContext(Context);
}
