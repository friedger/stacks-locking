import { Box, Button, CSSReset, Flex, ThemeProvider } from "@stacks/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { BlockchainApiClientProvider } from "@components/blockchain-api-client-provider";
import { NetworkProvider } from "@components/network-provider";
import { StackingClientProvider } from "@components/stacking-client-provider/stacking-client-provider";

import {
  AuthProvider,
  useAuth,
} from "./components/auth-provider/auth-provider";
import { SignIn } from "./pages/sign-in/sign-in";
import { useEffect } from "react";
import { loadFonts } from "@utils/load-fonts";
import { ChooseStackingMethod } from "./pages/choose-stacking-method/choose-stacking-method";
import { StartPooledStacking } from "./pages/stacking/start-pooled-stacking/start-pooled-stacking";

function Layout() {
  const { isSignedIn, signOut } = useAuth();

  return (
    <>
      <Flex h="100vh" flexDirection="column">
        {isSignedIn && (
          <Flex p="sm" justify="right">
            <Button onClick={() => signOut()}>Sign out</Button>
          </Flex>
        )}
        <Box>
          <Outlet />
        </Box>
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
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Navigate to="sign-in" /> },
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        element: <AuthGuard />,
        children: [
          {
            element: <Layout />,
            children: [
              {
                path: "choose-stacking-method",
                element: <ChooseStackingMethod />,
              },
              {
                path: "start-pooled-stacking",
                element: <StartPooledStacking />,
              },
              // {
              //   path: "pooled-stacking-info",
              //   element: <PooledStackingInfo />,
              // },
              //
              // {
              //   path: "start-direct-stacking",
              //   element: <StartDirectStacking />,
              // },
              // {
              //   path: "direct-stacking-info",
              //   element: <DirectStackingInfo />,
              // },
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
