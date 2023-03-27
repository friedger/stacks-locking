import {
  StackingOptionsCardContainer as OptionsContainer,
  StartStackingLayout as Layout,
} from './components/start-stacking-layout';
import { Box, Stack } from '@stacks/ui';
import { Messages } from './components/messages';
import { ChooseStackingMethodLayoutProps } from './types';
import { DirectStackingCard } from './components/direct-stacking-card';
import { PooledStackingCard } from './components/pooled-stacking-card';
import { figmaTheme } from '@constants/figma-theme';

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
