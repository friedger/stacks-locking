import { ReactNode, createContext, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';

import { StacksNetworkName } from '@stacks/network';
import { ChainID } from '@stacks/transactions';
import cookie from 'cookie';

import { Navigate } from '@components/navigate';

import { DEFAULT_DEVNET_SERVER, IS_BROWSER } from '../constants';
import { NetworkModeUrlMap } from '../constants/network';
import { Network } from '../types/network';

interface GlobalContextProps {
  cookies: string;
  apiUrls: Record<StacksNetworkName, string>;
  activeNetwork: Network;
  activeNetworkKey: string;
  addCustomNetwork: (network: Network) => Promise<boolean>;
  removeCustomNetwork: (network: Network) => void;
  networks: Record<string, Network>;
}

export const GlobalContext = createContext<GlobalContextProps>({
  cookies: '',
  apiUrls: NetworkModeUrlMap,
  activeNetwork: {
    label: 'stacks.co',
    url: NetworkModeUrlMap.mainnet,
    networkId: ChainID.Mainnet,
    mode: 'mainnet',
  },
  activeNetworkKey: NetworkModeUrlMap.mainnet,
  addCustomNetwork: () => Promise.resolve(false),
  removeCustomNetwork: () => true,
  networks: {},
});

interface AppContextProviderProps {
  cookies: string;
  queryNetworkMode: StacksNetworkName;
  queryApiUrl: string | null;
  apiUrls: Record<StacksNetworkName, string>;
  children: ReactNode;
}
export const AppContextProvider = ({
  cookies,
  queryNetworkMode,
  queryApiUrl,
  apiUrls,
  children,
}: AppContextProviderProps) => {
  if (IS_BROWSER && window?.location?.search?.includes('err=1')) throw new Error('test error');
  const customNetworksCookie = JSON.parse(cookie.parse(cookies || '').customNetworks || '{}');
  const [_, setCookie] = useCookies(['customNetworks']);
  const [customNetworks, setCustomNetworks] = useState(customNetworksCookie);
  const networks: Record<string, Network> = useMemo<Record<string, Network>>(
    () => ({
      [apiUrls.mainnet]: {
        label: 'hiro.so',
        url: apiUrls.mainnet,
        networkId: ChainID.Mainnet,
        mode: 'mainnet',
      },
      [apiUrls.testnet]: {
        label: 'hiro.so',
        url: apiUrls.testnet,
        networkId: ChainID.Testnet,
        mode: 'testnet',
      },
      [DEFAULT_DEVNET_SERVER]: {
        label: 'devnet',
        url: DEFAULT_DEVNET_SERVER,
        networkId: ChainID.Testnet,
        mode: 'testnet',
        isCustomNetwork: true,
      },
      ...customNetworks,
    }),
    [apiUrls, customNetworks]
  );

  const key = queryApiUrl || apiUrls[queryNetworkMode];
  const invalidKey = !networks[key];
  const activeNetworkKey = invalidKey ? apiUrls.mainnet : key;
  const activeNetwork = networks[activeNetworkKey];

  if (activeNetwork.mode !== queryNetworkMode) {
    return <Navigate to="." replace />;
  }

  return (
    <GlobalContext.Provider
      value={{
        activeNetwork,
        activeNetworkKey,
        cookies,
        apiUrls,
        addCustomNetwork: (network: Network) => {
          return new Promise<boolean>(resolve => {
            setCookie(
              'customNetworks',
              JSON.stringify({ ...customNetworks, [network.url]: network }),
              {
                path: '/',
                maxAge: 3600, // Expires after 1hr
                sameSite: true,
              }
            );
            setTimeout(() => {
              setCustomNetworks({
                ...customNetworks,
                [network.url]: { ...network, isCustomNetwork: true },
              });
              resolve(true);
            }, 100);
          });
        },
        removeCustomNetwork: (network: Network) => {
          const { [network.url]: _, ...remainingCustomNetworks } = customNetworks;
          setCookie('customNetworks', JSON.stringify(remainingCustomNetworks), {
            path: '/',
            maxAge: 3600, // Expires after 1hr
            sameSite: true,
          });
          setCustomNetworks(remainingCustomNetworks);
        },
        networks,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
