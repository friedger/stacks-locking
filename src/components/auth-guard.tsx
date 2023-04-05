import { Outlet } from 'react-router-dom';

import { useAuth } from './auth-provider/auth-provider';
import { Navigate } from './navigate';

export function AuthGuard() {
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
