import { useEffect } from 'react';
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

import { CSSReset, ThemeProvider } from '@stacks/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { BlockchainApiClientProvider } from '@components/blockchain-api-client-provider';
import { NetworkProvider } from '@components/network-provider';
import { StackingClientProvider } from '@components/stacking-client-provider/stacking-client-provider';
import { loadFonts } from '@utils/load-fonts';

import { AuthGuard } from './components/auth-guard';
import { AuthProvider } from './components/auth-provider/auth-provider';
import { Layout } from './components/layout';
import { ChooseStackingMethod } from './pages/choose-stacking-method/choose-stacking-method';
import { SignIn } from './pages/sign-in/sign-in';
import { DirectStackingInfo } from './pages/stacking/direct-stacking-info/direct-stacking-info';
import { DelegateStackStx } from './pages/stacking/pool-admin/delegate-stack-stx/delegate-stack-stx';
import { StackAggregationCommit } from './pages/stacking/pool-admin/stack-aggregation-commit/stack-aggregation-commit';
import { PooledStackingInfo } from './pages/stacking/pooled-stacking-info/pooled-stacking-info';
import { StackExtend } from './pages/stacking/stack-extend/stack-extend';
import { StackIncrease } from './pages/stacking/stack-increase/stack-increase';
import { StartDirectStacking } from './pages/stacking/start-direct-stacking/start-direct-stacking';
import { StartPooledStacking } from './pages/stacking/start-pooled-stacking/start-pooled-stacking';

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
              {
                path: 'lock-more-stx',
                element: <StackIncrease />,
              },
              {
                path: 'extend-stacking',
                element: <StackExtend />,
              },
              {
                path: 'pool-admin',
                children: [
                  { path: 'delegate-stack-stx', element: <DelegateStackStx /> },
                  { path: 'stack-aggregation-commit', element: <StackAggregationCommit /> },
                ],
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
