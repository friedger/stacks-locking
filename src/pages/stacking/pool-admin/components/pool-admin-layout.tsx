import { Box, Flex } from '@stacks/ui';

import { Screen } from '@components/screen';

type Slots = 'intro' | 'poolAdminPanel' | 'poolAdminForm';

type PoolAdminLayoutProps = Record<Slots, JSX.Element>;

export function PoolAdminLayout(props: PoolAdminLayoutProps) {
  const { intro, poolAdminPanel, poolAdminForm } = props;
  return (
    <Screen pt="80px" mb="extra-loose">
      <Flex
        flexDirection={['column-reverse', 'column-reverse', 'row']}
        justifyContent="space-between"
      >
        <Box maxWidth={[null, null, '544px']} mr={[null, null, 'extra-loose']}>
          {intro}
          <Box display={['block', null, 'none']} mt={['extra-loose', null, null, null, 'base']}>
            {poolAdminPanel}
          </Box>
          {poolAdminForm}
        </Box>
        <Box display={['none', null, 'block']}>{poolAdminPanel}</Box>
      </Flex>
    </Screen>
  );
}
