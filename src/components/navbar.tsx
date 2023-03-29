import { Link } from 'react-router-dom';

import { Box, Button, Flex, Text } from '@stacks/ui';
import { useHover } from 'use-events';

import { Stacks } from '@components/icons/stacks';
import { figmaTheme } from '@constants/figma-theme';
import { truncateMiddle } from '@utils/tx-utils';

import { useAuth } from './auth-provider/auth-provider';
import { NetworkInfo } from './network-info';
import { OpenLinkInNewTab } from './open-link-in-new-tab';

export function Navbar() {
  const { isSignedIn, signOut, signIn, address } = useAuth();
  const [isHovered, bind] = useHover();

  return (
    <Flex
      flexDirection="row"
      justifyContent="space-between"
      p="base-loose"
      borderBottom={`1px solid ${figmaTheme.borderSubdued}`}
    >
      <Flex alignItems="center">
        <Link to="/">
          <Flex alignItems="center">
            <Box pl="12px" pr="extra-tight">
              <Stacks />
            </Box>
            <Text color={figmaTheme.text} fontWeight={500}>
              / Stacking
            </Text>
          </Flex>
        </Link>
      </Flex>
      <Box>
        <Flex p="sm" justify="right" alignItems="center">
          <NetworkInfo />
          <OpenLinkInNewTab href="https://wallet.hiro.so/wallet/faq#stacking" px="loose">
            <Text color={figmaTheme.text} fontWeight={500}>
              FAQ
            </Text>
          </OpenLinkInNewTab>
          <Box pr="12px">
            {isSignedIn && address ? (
              <Button
                width="142px"
                boxShadow="none"
                _hover={{ boxShadow: 'none' }}
                mode="tertiary"
                onClick={() => signOut()}
                {...bind}
              >
                {isHovered ? 'Sign out' : truncateMiddle(address)}
              </Button>
            ) : (
              <Button
                boxShadow="none"
                _hover={{ boxShadow: 'none' }}
                mode="tertiary"
                onClick={() => signIn()}
              >
                Connect wallet
              </Button>
            )}
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
