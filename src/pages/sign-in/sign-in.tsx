import { Navigate } from 'react-router-dom';

import { useAuth } from '@components/auth-provider/auth-provider';
import { ChooseStackingMethod } from '../choose-stacking-method/choose-stacking-method';

export function SignIn() {
  const { isSignedIn } = useAuth();
  if (isSignedIn) {
    return <Navigate to="../choose-stacking-method" />;
  }

  return <ChooseStackingMethod />;
}
