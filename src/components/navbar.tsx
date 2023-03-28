import { ExternalLink } from '@components/external-link';
import { Stacks } from '@components/icons/stacks';
import { figmaTheme } from '@constants/figma-theme';
import { Box, Button, Flex, Text } from '@stacks/ui';
import { truncateMiddle } from '@utils/tx-utils';
import { Link } from 'react-router-dom';
import { useHover } from 'use-events';
import { useAuth } from './auth-provider/auth-provider';

export function Navbar() {
  const { isSignedIn, signOut, signIn, address } = useAuth();
  const [isHovered, bind] = useHover();

  return (
    <Flex
      flexDirection="row"
      justifyContent="space-between"
      p="tight"
      borderBottom={`1px solid ${figmaTheme.borderSubdued}`}
    >
      <Flex alignItems="center" pl="loose">
        <Link to="/">
          <Flex alignItems="center">
            <Box pr="extra-tight">
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
          <ExternalLink href="https://wallet.hiro.so/wallet/faq#stacking" px="loose">
            <Text color={figmaTheme.text} fontWeight={500}>
              FAQ
            </Text>
          </ExternalLink>
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
            <Button onClick={() => signIn()}>Connect wallet</Button>
          )}
        </Flex>
      </Box>
    </Flex>
  );
}
