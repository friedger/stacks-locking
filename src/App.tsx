import { useEffect } from 'react';
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

import { StackingClientProvider } from '@components/stacking-client-provider/stacking-client-provider';
import { Button, CSSReset, Flex, ThemeProvider, color } from '@stacks/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { loadFonts } from '@utils/load-fonts';

import { AuthProvider, useAuth } from './components/auth-provider/auth-provider';
import { ChooseStackingMethod } from './pages/choose-stacking-method/choose-stacking-method';
import { SignIn } from './pages/sign-in/sign-in';
import { DelegatedStacking } from './pages/stacking/delegated-stacking/pooled-stacking';
import { DelegationAndLockingInfo } from './pages/stacking/delegation-and-stacking-info/delegation-and-stacking-info';

import { theme as uiTheme } from '@stacks/ui-theme';

export const theme = {
  ...uiTheme,
  colors: {
    ...uiTheme.colors,
    ink: {
      ...uiTheme.colors.ink,
      400: '#9C9CA2',
      1000: '#141416',
    },
  },
  fonts: {
    ...uiTheme.fonts,
    heading:
      '"Open Sauce One", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
};

function Container() {
  const { isSignedIn, signOut } = useAuth();
  return (
    <>
      <Flex flexDirection="column" flexGrow={1} background={color('bg')}>
        {isSignedIn && (
          <Flex justifyContent="flex-end">
            <Button onClick={() => signOut()}>Sign out</Button>
          </Flex>
        )}
        <Flex flexGrow={1} position="relative">
          <Outlet />
        </Flex>
      </Flex>
    </>
  );
}
const queryClient = new QueryClient();
function Root() {
  useEffect(() => void loadFonts(), []);
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        {CSSReset}
        <AuthProvider>
          <StackingClientProvider>
            <Outlet />
          </StackingClientProvider>
        </AuthProvider>
      </ThemeProvider>
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
            element: <Container />,
            children: [
              {
                path: 'choose-stacking-method',
                element: <ChooseStackingMethod />,
              },
              {
                path: 'pooled-stacking',
                element: <DelegatedStacking />,
              },
              {
                path: 'pooling-and-stacking-info',
                element: <DelegationAndLockingInfo />,
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
