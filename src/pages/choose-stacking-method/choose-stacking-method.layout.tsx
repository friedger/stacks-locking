import {
  StackingOptionsCardContainer as CardContainer,
  StartStackingLayout as Layout,
} from './components/start-stacking-layout';
import { Stack } from '@stacks/ui';
import { Messages } from './components/messages';
import { ChooseStackingMethodLayoutProps } from './types';
import { DirectStackingCard } from './components/direct-stacking-card';
import { PooledStackingCard } from './components/pooled-stacking-card';

export function ChooseStackingMethodLayout(props: ChooseStackingMethodLayoutProps) {
  return (
    <Layout>
      <Stack>
        {props.isSignedIn && <Messages {...props} />}
        <CardContainer>
          <PooledStackingCard {...props} />
          <DirectStackingCard {...props} />
        </CardContainer>
      </Stack>
    </Layout>
  );
}
