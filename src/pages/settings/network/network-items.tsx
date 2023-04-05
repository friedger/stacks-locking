'use client';

import React, { ReactNode } from 'react';
import { TbCheck, TbTrash } from 'react-icons/tb';
import { useNavigate as useNavigateRouterDom } from 'react-router-dom';

import { Configuration, InfoApi } from '@stacks/blockchain-api-client';
import { CoreNodeInfoResponse } from '@stacks/blockchain-api-client/src/generated/models';
import { StacksNetworkName } from '@stacks/network';
import { ChainID } from '@stacks/transactions';
import { Box, Flex, FlexProps, IconButton, Spinner, Stack, Tooltip, color } from '@stacks/ui';
import { BoxProps } from '@stacks/ui-core';
import { useQuery } from '@tanstack/react-query';

import { Title as StacksTitle } from '@components/title';
import { Caption } from '@components/typography';
import routes from '@constants/routes';
import { useNavigate } from '@hooks/use-navigate';
import { createSearch } from '@utils/networks';
import { ONE_MINUTE } from '@utils/query-stale-time';

import { Badge } from '../../../components/badge';
import { useGlobalContext } from '../../../context/use-app-context';
import { Network, whenStacksChainId } from '../../../types/network';

const Title = ({ children, bold }: { children: ReactNode; bold?: boolean }) => {
  return (
    <StacksTitle
      fontSize="20px"
      lineHeight="28px"
      display="block"
      fontWeight={bold ? 400 : undefined}
    >
      {children}
    </StacksTitle>
  );
};
interface ItemWrapperProps extends FlexProps {
  isDisabled?: string | boolean;
  isActive?: boolean;
}

const ItemWrapper: React.FC<ItemWrapperProps> = ({ isActive, isDisabled, ...props }) => {
  return (
    <Flex
      opacity={isDisabled ? 0.5 : 1}
      alignItems="center"
      justifyContent="space-between"
      position="relative"
      zIndex="999"
      bg={isDisabled ? 'bg-4' : 'bg'}
      cursor={isDisabled ? 'not-allowed' : 'unset'}
      _hover={{
        bg: isDisabled ? 'unset' : isActive ? 'unset' : 'bgAlt',
        cursor: isDisabled ? 'not-allowed' : isActive ? 'default' : 'pointer',
      }}
      {...props}
    />
  );
};

interface ItemProps extends ItemWrapperProps {
  item: Network;
  isCustom?: boolean;
}

const getCustomNetworkApiInfo = (baseUrl: string) => () => {
  const coreInfoApi = new InfoApi(new Configuration({ basePath: baseUrl }));
  return coreInfoApi.getCoreApiInfo();
};

export const NetworkBadge = ({ mode }: { mode: StacksNetworkName }) => {
  return (
    <Badge bg={color('bg-4')} ml="8px" color={color('text-caption')}>
      {mode}
    </Badge>
  );
};
const Item = ({ item, isActive, isDisabled, onClick, isCustom, ...rest }: ItemProps) => {
  const {
    removeCustomNetwork,
    apiUrls: { mainnet, testnet },
  } = useGlobalContext();
  const isMainnet = item.url === mainnet;
  const isTestnet = item.url === testnet;
  const isDefault = isMainnet || isTestnet;

  let itemNetworkId: ChainID.Mainnet | ChainID.Testnet = isMainnet
    ? ChainID.Mainnet
    : ChainID.Testnet;

  const doNotFetch = isDisabled || !item.url || isDefault;

  const { data, error, isInitialLoading } = useQuery<CoreNodeInfoResponse, Error>(
    ['customNetworkApiInfo', item.url],
    getCustomNetworkApiInfo(item.url),
    {
      staleTime: ONE_MINUTE,
      enabled: !doNotFetch,
      suspense: false,
      useErrorBoundary: false,
    }
  );

  if (!isDefault && data) {
    itemNetworkId = data?.network_id && data.network_id;
  }

  const itemNetworkMode: StacksNetworkName = whenStacksChainId(itemNetworkId)({
    [ChainID.Mainnet]: 'mainnet',
    [ChainID.Testnet]: 'testnet',
  });

  return (
    <ItemWrapper
      isActive={isActive}
      isDisabled={!!isDisabled || !!error || isInitialLoading}
      {...rest}
    >
      <Stack
        pl="32px"
        pr={'32px'}
        py="16px"
        width="100%"
        flexGrow={1}
        spacing="8px"
        onClick={onClick}
      >
        <Flex alignItems="center">
          <Title>{item.label}</Title>
          {itemNetworkMode ? <NetworkBadge mode={itemNetworkMode} /> : null}
        </Flex>
        <Caption display="block">
          {item?.url?.includes('//') ? item?.url?.split('//')[1] : item?.url || isDisabled}
        </Caption>
      </Stack>
      <Flex alignItems="center" pr={'32px'} py="16px" position={'relative'}>
        {isCustom && !isActive ? (
          <Tooltip label="Remove network">
            <IconButton
              position="relative"
              zIndex={999}
              size={'21px'}
              icon={() => (
                <span>
                  <TbTrash size={'21px'} />
                </span>
              )}
              onClick={() => removeCustomNetwork(item)}
              aria-label={'Remove network'}
              _hover={{ bg: 'rgba(255, 255, 255, 0.25)' }}
            />
          </Tooltip>
        ) : isInitialLoading ? (
          <Spinner size="18px" opacity={0.5} color={'#666'} />
        ) : error ? (
          <Caption color={color('feedback-error')}>Offline</Caption>
        ) : isActive ? (
          <Box as={TbCheck} color={color('feedback-success')} size="18px" />
        ) : null}
      </Flex>
    </ItemWrapper>
  );
};

const AddNetwork: React.FC<ItemWrapperProps> = ({ onClick, ...rest }) => {
  const navigate = useNavigate();
  return (
    <ItemWrapper
      onClick={e => {
        navigate(routes.ADD_NETWORK);
        onClick?.(e);
      }}
      py="24px"
      px="32px"
      borderTopWidth="1px"
      {...rest}
    >
      <Title bold>Add a network</Title>
    </ItemWrapper>
  );
};

interface NetworkItemsProps extends BoxProps {
  onItemClick?: (item: Network | 'new') => void;
}

function NetworkItemsComponent({ onItemClick }: NetworkItemsProps) {
  const navigate = useNavigateRouterDom();
  const { networks, activeNetwork } = useGlobalContext();
  return (
    <>
      {Object.values<Network>(networks).map((network, key) => {
        const isActive = activeNetwork.url === network.url;
        return (
          <Item
            isActive={isActive}
            item={network}
            key={key}
            isCustom={key >= 3}
            onClick={() => {
              setTimeout(() => {
                onItemClick?.(network);
                if (!isActive) {
                  const to = {
                    pathname: '/',
                    search: createSearch(network),
                  };
                  navigate(to);
                }
              }, 250);
            }}
          />
        );
      })}
      <AddNetwork
        onClick={() => {
          onItemClick?.('new');
        }}
      />
    </>
  );
}

export const NetworkItems = React.memo(NetworkItemsComponent);
