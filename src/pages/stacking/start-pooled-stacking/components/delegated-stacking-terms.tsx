import { IconLock } from '@tabler/icons';

import { StepsIcon } from '@components/icons/steps';
import { Box, Flex, List, Text } from '@mantine/core';
import { ReactNode } from 'react';

/**
 * Ensures list item marker icons of different sizes are algined with each other.
 */
function IconBoundary({ children }: { children: ReactNode }) {
  return (
    // The height and width values are set to "xl", which coincides with the 24px dimensions of the
    // icons in `@tabler/icons` frequently used with Mantine. When using icons from other icons
    // sets, they should be relatively well aligned, although some icon resizing may be necessary.
    <Flex w="xl" h="xl" justify="center" align="center">
      {children}
    </Flex>
  );
}
export function DelegatedStackingTerms() {
  return (
    <Box
      sx={t => ({
        borderLeft: `4px solid ${t.colors.orange[5]}`,
        paddingLeft: t.spacing.xs,
      })}
    >
      <List spacing="xs">
        <List.Item
          icon={
            <IconBoundary>
              <IconLock />
            </IconBoundary>
          }
        >
          <Text>This transaction can't be reversed</Text>
          <Text>
            There will be no way to unlock your STX once the pool has started stacking them. You
            will need to wait until they unlock at the end of the pool's chosen number of cycles.
          </Text>
        </List.Item>
        <List.Item
          icon={
            <IconBoundary>
              <StepsIcon></StepsIcon>
            </IconBoundary>
          }
        >
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
