import { Box } from '@stacks/ui';
import { figmaTheme } from '@constants/figma-theme';
import { OpenLinkInNewTab } from '@components/open-link-in-new-tab';

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
      our{' '}
      <OpenLinkInNewTab display="inline" href="https://wallet.hiro.so/wallet/faq#stacking">
        FAQs
      </OpenLinkInNewTab>{' '}
      and review our{' '}
      <OpenLinkInNewTab display="inline" href="https://www.hiro.so/terms">
        Terms
      </OpenLinkInNewTab>{' '}
      to learn more.
    </Box>
  );
}
