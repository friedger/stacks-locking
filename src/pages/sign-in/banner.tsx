import { Box } from '@stacks/ui';
import { figmaTheme } from '@constants/figma-theme';
import { ExternalLink } from '@components/external-link';

export function Banner() {
  return (
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
      our <ExternalLink href="https://wallet.hiro.so/wallet/faq">FAQs</ExternalLink> and review our{' '}
      <ExternalLink href="https://www.hiro.so/terms">Terms</ExternalLink> to learn more.
    </Box>
  );
}
