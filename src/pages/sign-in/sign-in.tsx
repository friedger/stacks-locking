import { Navigate } from 'react-router-dom';

import { useAuth } from '@components/auth-provider/auth-provider';
import { ChooseStackingMethod } from '../choose-stacking-method/choose-stacking-method';
import { Box, Button } from '@stacks/ui';
import { Banner } from './banner';

export function SignIn() {
  const { isSignedIn } = useAuth();
  if (isSignedIn) {
    return <Navigate to="../choose-stacking-method" />;
  }

  return (
    <Box>
      <Banner />
      <ChooseStackingMethod />
    </Box>
  );
}
