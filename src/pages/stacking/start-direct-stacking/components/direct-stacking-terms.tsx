import React, { FC, ReactNode } from 'react';
import { Box, Flex, List, Stack, Text } from '@mantine/core';
import { StackingTermItem, StackingTermItemProps } from '../../components/stacking-term';
import { pseudoBorderLeft } from '@components/styles/pseudo-border-left';
import { IconClock, IconLock } from '@tabler/icons';
import { StepsIcon } from '@components/icons/steps';

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

export function DirectStackingTerms() {
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
          <Text>This transaction can’t be reversed</Text>
          <Text>
            STX will be locked in your wallet for your chosen duration, even if an increase in the
            minimum causes you to end up with fewer or no reward slots.
          </Text>
          <Text>
            There will be no way to unlock your STX before the chosen duration is finished.
          </Text>
          <Text>
            Nor will you be able to change the entered BTC address. Ensure it's entered correctly
            and you have control over it.
          </Text>
        </List.Item>
        <List.Item
          icon={
            <IconBoundary>
              <IconClock />
            </IconBoundary>
          }
        >
          <Text>Consider the following cooldown cycle</Text>
          <Text>
            After your chosen duration is finished, you have to wait one cycle before you can stack
            from this address again
          </Text>
        </List.Item>
        <List.Item
          icon={
            <IconBoundary>
              <StepsIcon />
            </IconBoundary>
          }
        >
          <Text>Dynamic minimum</Text>
          <Text>
            If the minimum increases, you could end up with fewer or no reward slots, even if you’ve
            added a buffer. There will be no way to lock more STX for Stacking with this address
            until the selected duration is finished.
          </Text>
        </List.Item>
      </List>
    </Box>
  );
}
