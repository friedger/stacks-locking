import { Screen } from '@components/screen';
import { Box, Flex } from '@stacks/ui';

type Slots = 'intro' | 'stackingInfoPanel' | 'stackingForm';

type StartStackingLayoutProps = Record<Slots, JSX.Element>;

export function StartStackingLayout(props: StartStackingLayoutProps) {
  const { intro, stackingInfoPanel, stackingForm } = props;
  return (
    <Screen pt="80px" mb="extra-loose">
      <Flex
        flexDirection={['column-reverse', 'column-reverse', 'row']}
        justifyContent="space-between"
      >
        <Box maxWidth={[null, null, '544px']} mr={[null, null, 'extra-loose']}>
          {intro}
          <Box display={['block', null, 'none']} mt={['extra-loose', null, null, null, 'base']}>
            {stackingInfoPanel}
          </Box>
          {stackingForm}
        </Box>
        <Box display={['none', null, 'block']}>{stackingInfoPanel}</Box>
      </Flex>
    </Screen>
  );
}
