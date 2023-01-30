import { ReactNode, createContext, useContext, useState } from "react";

import { UserData } from "@stacks/auth";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { validateStacksAddress as isValidStacksAddress } from "@stacks/transactions";

import { useNetwork } from "@components/network-provider";

const appConfig = new AppConfig(["store_write"]);
const userSession = new UserSession({ appConfig });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAccountAddress(userData: any, network: string) {
  // NOTE: Although this approach to obtain the user's address is good enough for now, it is quite brittle.
  // It relies on a variable having the same value as the object key below. Type checking is not available given the `userSession` object managed by `@stacks/connect` is typed as `any`.
  //
  // Should this be a source of issues, it may be worth refactoring.
  const address: string = userData?.profile?.stxAddress?.[network];

  if (!isValidStacksAddress(address)) {
    return null;
  }

  return address;
}

interface AuthContext {
  isSigningIn: boolean;
  isSignedIn: boolean;
  signIn(): void;
  signOut(): void;
  userData: null | UserData;
  address: null | string;
}

// The context type is non-null to avoid null checks wherever the context is used.
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const AuthContext = createContext<AuthContext>(null!);

interface Props {
  children: ReactNode;
}
export function AuthProvider({ children }: Props) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [hasSearchedForExistingSession, setHasSearchedForExistingSession] =
    useState(false);
  const { networkName } = useNetwork();

  function signIn() {
    if (isSigningIn) {
      console.warn("Attempted to sign in while sign is is in progress.");
      return;
    }
    setIsSigningIn(true);
    showConnect({
      userSession,
      appDetails: {
        name: "Stacking on the web",
        icon: "http://placekitten.com/200/200",
      },
      onFinish() {
        setIsSigningIn(false);
        setIsSignedIn(true);
      },
      onCancel() {
        setIsSigningIn(false);
      },
    });
  }

  function signOut() {
    userSession.signUserOut();
    setIsSignedIn(false);
  }

  if (!hasSearchedForExistingSession) {
    if (userSession.isUserSignedIn()) {
      setIsSignedIn(true);
    }

    setHasSearchedForExistingSession(true);
    return null;
  }

  let userData = null;
  try {
    userData = userSession.loadUserData();
  } catch {
    // do nothing
  }

  const address = getAccountAddress(userData, networkName);

  return (
    <>
      <AuthContext.Provider
        value={{ isSigningIn, isSignedIn, signIn, signOut, userData, address }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
