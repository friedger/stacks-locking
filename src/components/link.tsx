import { Link as ReactRouterLink } from 'react-router-dom';

import { LegalDisclaimerTooltip } from './legal-disclaimer-tooltip';
import { Box, BoxProps, Text, color } from '@stacks/ui';
import { openExternalLink } from '@utils/external-links';

interface Props extends BoxProps {
  to: string;
}

export function Link({ to, children, ...props }: Props) {
  return (
    <Box
      display="inline"
      cursor="pointer"
      outline={0}
      color={color('brand')}
      _hover={{ textDecoration: 'underline' }}
      _focus={{ textDecoration: 'underline' }}
      {...props}
    >
      <ReactRouterLink to={to}>{children}</ReactRouterLink>
    </Box>
  );
}
