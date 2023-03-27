import { Navigate } from 'react-router-dom';

import { useAuth } from '@components/auth-provider/auth-provider';
import { ChooseStackingMethod } from '../choose-stacking-method/choose-stacking-method';
import { Box, Button } from '@stacks/ui';
import { figmaTheme } from '@constants/figma-theme';
import { ExternalLink } from '@components/external-link';

export function SignIn() {
  const { isSignedIn } = useAuth();
  if (isSignedIn) {
    return <Navigate to="../choose-stacking-method" />;
  }

  return (
    <Box>
      <Box
        color={figmaTheme.textSubdued}
        backgroundColor={figmaTheme.backgroundSubdued}
        fontSize="12px"
        textAlign="center"
        px="24px"
        py="8px"
      >
        This website provides the interface to connect with the Stacking protocol or delegate to a
        Stacking pool provider directly. We don&apos;t provide the Stacking service ourselves. Read
        our <ExternalLink href="https://wallet.hiro.so/wallet/faq">FAQs</ExternalLink> and review
        our <ExternalLink href="https://www.hiro.so/terms">Terms</ExternalLink> to learn more.
      </Box>
      <ChooseStackingMethod />
    </Box>
  );
}
