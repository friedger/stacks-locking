import { Box, Stack } from '@stacks/ui';

import { figmaTheme } from '@constants/figma-theme';

import { DirectStackingCard } from './components/direct-stacking-card';
import { Messages } from './components/messages';
import { PooledStackingCard } from './components/pooled-stacking-card';
import {
  StartStackingLayout as Layout,
  StackingOptionsCardContainer as OptionsContainer,
} from './components/start-stacking-layout';
import { ChooseStackingMethodLayoutProps } from './types';

function Separator() {
  return (
    <Box
      display={['none', 'none', 'none', 'inherit']}
      borderLeft={`1px solid ${figmaTheme.borderSubdued}`}
    ></Box>
  );
}

export function ChooseStackingMethodLayout(props: ChooseStackingMethodLayoutProps) {
  return (
    <Layout>
      <Stack height="100%" justifyContent="center">
        {props.isSignedIn && (
          <Box pt="base">
            <Messages {...props} />
          </Box>
        )}
        <OptionsContainer>
          <PooledStackingCard {...props} />
          <Separator />
          <DirectStackingCard {...props} />
        </OptionsContainer>
      </Stack>
    </Layout>
  );
}
