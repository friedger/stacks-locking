import { figmaTheme } from '@constants/figma-theme';
import { Flex, Text } from '@stacks/ui';
import { OpenLinkInNewTab } from './open-link-in-new-tab';

export function Footer() {
  return (
    <Flex
      flexDirection="row"
      justifyContent="center"
      p="tight"
      borderTop={`1px solid ${figmaTheme.borderSubdued}`}
      columnGap="loose"
    >
      <OpenLinkInNewTab
        color={figmaTheme.text}
        fontWeight={500}
        sx={{ textDecoration: 'underline' }}
        href={'https://www.hiro.so/terms'}
      >
        Terms of Use
      </OpenLinkInNewTab>
      <OpenLinkInNewTab
        color={figmaTheme.text}
        fontWeight={500}
        sx={{ textDecoration: 'underline' }}
        href={'https://wallet.hiro.so/wallet/faq#stacking'}
      >
        FAQ
      </OpenLinkInNewTab>
    </Flex>
  );
}
