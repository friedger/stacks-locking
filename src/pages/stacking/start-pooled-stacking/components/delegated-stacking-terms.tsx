import { IconLock, IconStairs } from '@tabler/icons-react';

import { Box, List, Text } from '@mantine/core';

export function DelegatedStackingTerms() {
  return (
    <Box
      sx={t => ({
        borderLeft: `4px solid ${t.colors.orange[5]}`,
        paddingLeft: t.spacing.xs,
      })}
    >
      <List spacing="xs">
        <List.Item icon={<IconLock />}>
          <Text>This transaction can't be reversed</Text>
          <Text>
            There will be no way to unlock your STX once the pool has started stacking them. You
            will need to wait until they unlock at the end of the pool's chosen number of cycles.
          </Text>
        </List.Item>
        <List.Item icon={<IconStairs />}>
          <Text>Research your pool</Text>
          <Text>
            Paying out rewards is at the discretion of the pool. Make sure you’ve researched and
            trust the pool you’re using. All pools are unaffiliated with Hiro PBC.
          </Text>
        </List.Item>
      </List>
    </Box>
  );
}
