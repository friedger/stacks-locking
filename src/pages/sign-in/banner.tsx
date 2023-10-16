import { Box } from '@stacks/ui';

import { figmaTheme } from '@constants/figma-theme';

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
      Stacking pool provider directly. We don&apos;t provide the Stacking service ourselves.
    </Box>
  );
}
