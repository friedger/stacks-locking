import { Box } from '@stacks/ui';

import { useAuth } from '@components/auth-provider/auth-provider';
import { Navigate } from '@components/navigate';

import { Hero } from '../../components/hero';
import { ChooseStackingMethodAuthHandler } from '../choose-stacking-method/choose-stacking-method';
import { Banner } from './banner';

export function SignIn() {
  const { isSignedIn } = useAuth();
  if (isSignedIn) {
    return <Navigate to={'../choose-stacking-method'} replace />;
  }

  return (
    <Box>
      <Banner />
      <Hero />
      <ChooseStackingMethodAuthHandler />
    </Box>
  );
}
