import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from './auth-provider/auth-provider';

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
