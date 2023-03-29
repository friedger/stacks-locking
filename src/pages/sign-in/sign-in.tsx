import { Navigate } from 'react-router-dom';

import { Box, Button } from '@stacks/ui';

import { useAuth } from '@components/auth-provider/auth-provider';

import { Hero } from '../../components/hero';
import {
  ChooseStackingMethod,
  ChooseStackingMethodAuthHandler,
} from '../choose-stacking-method/choose-stacking-method';
import { Banner } from './banner';

export function SignIn() {
  const { isSignedIn } = useAuth();
  if (isSignedIn) {
    return <Navigate to="../choose-stacking-method" />;
  }

  return (
    <Box>
      <Banner />
      <Hero />
      <ChooseStackingMethodAuthHandler />
    </Box>
  );
}
