import { Box, BoxProps, Text, color } from '@stacks/ui';

import { openExternalLink } from '@utils/external-links';

interface Props extends BoxProps {
  href: string;
}

export function OpenLinkInNewTab({ href, children, ...props }: Props) {
  const openUrl = () => openExternalLink(href);
  return (
    <Text
      onClick={openUrl}
      as="a"
      type="a"
      cursor="pointer"
      display="block"
      outline={0}
      color={color('brand')}
      _hover={{ textDecoration: 'underline' }}
      _focus={{ textDecoration: 'underline' }}
      {...props}
    >
      {children}
      <Box display="inline-block" ml="extra-tight" mb="1px">
        ↗
      </Box>
    </Text>
  );
}
