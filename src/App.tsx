import { useEffect } from 'react';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';

import { BlockchainApiClientProvider } from '@components/blockchain-api-client-provider';
import { ExternalLink } from '@components/external-link';
import { Stacks } from '@components/icons/stacks';
import { Link } from '@components/link';
import { NetworkProvider } from '@components/network-provider';
import { StackingClientProvider } from '@components/stacking-client-provider/stacking-client-provider';
import { figmaTheme } from '@constants/figma-theme';
import { Box, Button, CSSReset, Flex, Text, ThemeProvider } from '@stacks/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { loadFonts } from '@utils/load-fonts';
import { truncateMiddle } from '@utils/tx-utils';
import { useHover } from 'use-events';
import { AuthProvider, useAuth } from './components/auth-provider/auth-provider';
import { ChooseStackingMethod } from './pages/choose-stacking-method/choose-stacking-method';
import { SignIn } from './pages/sign-in/sign-in';
import { DirectStackingInfo } from './pages/stacking/direct-stacking-info/direct-stacking-info';
import { PooledStackingInfo } from './pages/stacking/pooled-stacking-info/pooled-stacking-info';
import { StartDirectStacking } from './pages/stacking/start-direct-stacking/start-direct-stacking';
import { StartPooledStacking } from './pages/stacking/start-pooled-stacking/start-pooled-stacking';

function Navbar() {
  const { isSignedIn, signOut, signIn, address } = useAuth();
  const [isHovered, bind] = useHover();

  return (
    <Flex
      flexDirection="row"
      justifyContent="space-between"
      p="tight"
      borderBottom={`1px solid ${figmaTheme.borderSubdued}`}
    >
      <Flex alignItems="center">
        <Box pr="extra-tight">
          <Stacks />
        </Box>
        <Text color={figmaTheme.text} fontWeight={500}>
          / Stacking
        </Text>
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

function Footer() {
  return (
    <Flex
      flexDirection="row"
      justifyContent="center"
      p="tight"
      borderTop={`1px solid ${figmaTheme.borderSubdued}`}
    >
      <Link to="https://www.hiro.so/terms" px="loose">
        <Text color={figmaTheme.text} fontWeight={500}>
          Terms of Use
        </Text>
      </Link>
    </Flex>
  );
}
function Layout() {
  return (
    <>
      <Flex h="100vh" flexDirection="column">
        <Navbar />
        <Box>
          <Outlet />
        </Box>
        <Footer />
      </Flex>
    </>
  );
}
const queryClient = new QueryClient();
function Root() {
  useEffect(() => void loadFonts(), []);
  return (
    <QueryClientProvider client={queryClient}>
      <NetworkProvider>
        <AuthProvider>
          <StackingClientProvider>
            <BlockchainApiClientProvider>
              <ThemeProvider>
                {CSSReset}
                <Outlet />
              </ThemeProvider>
            </BlockchainApiClientProvider>
          </StackingClientProvider>
        </AuthProvider>
      </NetworkProvider>
    </QueryClientProvider>
  );
}

function AuthGuard() {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) {
    return <Navigate to="../sign-in" />;
  }

  return (
    <>
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Navigate to="sign-in" /> },
      {
        path: 'sign-in',
        element: <Layout />,
        children: [
          {
            index: true,
            element: <SignIn />,
          },
        ],
      },
      {
        element: <AuthGuard />,
        children: [
          {
            element: <Layout />,
            children: [
              {
                path: 'choose-stacking-method',
                element: <ChooseStackingMethod />,
              },
              {
                path: 'start-pooled-stacking',
                element: <StartPooledStacking />,
              },
              {
                path: 'pooled-stacking-info',
                element: <PooledStackingInfo />,
              },
              {
                path: 'start-direct-stacking',
                element: <StartDirectStacking />,
              },
              {
                path: 'direct-stacking-info',
                element: <DirectStackingInfo />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
