import { useEffect } from 'react';
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Button, Container, Flex, Text, Group, MantineProvider, Title } from '@mantine/core';
import { StackingClientProvider } from '@components/stacking-client-provider/stacking-client-provider';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { loadFonts } from '@utils/load-fonts';
import { ModalsProvider } from '@mantine/modals';
import { AuthProvider, useAuth } from './components/auth-provider/auth-provider';
import { SignIn } from './pages/sign-in/sign-in';
import { ChooseStackingMethod } from './pages/choose-stacking-method/choose-stacking-method';
import { StartPooledStacking } from './pages/stacking/start-pooled-stacking/start-pooled-stacking';
import { PooledStackingInfo } from './pages/stacking/pooled-stacking-info/pooled-stacking-info';
import { truncateMiddle } from '@utils/tx-utils';
import { ErrorAlert } from '@components/error-alert';
import { Configuration, NamesApi } from '@stacks/blockchain-api-client';
import { NETWORK } from './constants';
import { toUnicode } from 'punycode';

function Profile() {
  const { address } = useAuth();
  const q = useQuery(['bns'], () => {
    const basePath =
      NETWORK === 'testnet'
        ? 'https://stacks-node-api.testnet.stacks.co'
        : 'https://stacks-node-api.mainnet.stacks.co';
    const client = new NamesApi(new Configuration({ basePath }));
    return client.getNamesOwnedByAddress({
      address: address ?? '',
      blockchain: 'stacks',
    });
  });

  if (!address) {
    const msg = 'Expected `address` to be defined.';
    console.error(msg);
    return <ErrorAlert id="71582283-38b4-497d-b7ce-b8d524699653">{msg}</ErrorAlert>;
  }

  const parseIfValidPunycode = (s: string) => {
    try {
      return toUnicode(s);
    } catch {
      return s;
    }
  };
  const bnsName = parseIfValidPunycode(q.data?.names[0] ?? '');
  return (
    <Group position="right">
      {bnsName && <Text>{bnsName}</Text>}
      <Text>{truncateMiddle(address)}</Text>
    </Group>
  );
}

function Layout() {
  const { isSignedIn, signOut } = useAuth();

  return (
    <>
      <Flex h="100vh" direction="column">
        {isSignedIn && (
          <Group p="sm" position="right">
            <Profile />
            <Button onClick={() => signOut()}>Sign out</Button>
          </Group>
        )}
        <Container h="100%" fluid>
          <Outlet />
        </Container>
      </Flex>
    </>
  );
}
const queryClient = new QueryClient();
function Root() {
  useEffect(() => void loadFonts(), []);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StackingClientProvider>
          <MantineProvider withGlobalStyles withNormalizeCSS theme={{ primaryColor: 'violet' }}>
            <ModalsProvider>
              <Outlet />
            </ModalsProvider>
          </MantineProvider>
        </StackingClientProvider>
      </AuthProvider>
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
        element: <SignIn />,
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
                path: 'direct-stacking-info',
                element: <Title>Direct Stacking Info</Title>,
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
