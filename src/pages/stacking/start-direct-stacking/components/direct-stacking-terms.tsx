import { Box, List, Text } from "@mantine/core";
import { IconLock, IconStairs } from "@tabler/icons-react";

export function DirectStackingTerms() {
  return (
    <Box
      sx={(t) => ({
        borderLeft: `4px solid ${t.colors.orange[5]}`,
        paddingLeft: t.spacing.xs,
      })}
    >
      <List spacing="xs">
        <List.Item icon={<IconLock />}>
          <Text>This transaction can’t be reversed</Text>
          <Text c="dimmed">
            STX will be locked in your wallet for your chosen duration, even if
            an increase in the minimum causes you to end up with fewer or no
            reward slots.
          </Text>
          <Text c="dimmed">
            There will be no way to unlock your STX before the chosen duration
            is finished.
          </Text>
          <Text c="dimmed">
            Nor will you be able to change the entered BTC address. Ensure it's
            entered correctly and you have control over it.
          </Text>
        </List.Item>

        <List.Item icon={<IconStairs />}>
          <Text>Dynamic minimum</Text>
          <Text c="dimmed">
            If the minimum increases, you could end up with fewer or no reward
            slots, even if you’ve added a buffer. There will be no way to lock
            more STX for Stacking with this address until the selected duration
            is finished.
          </Text>
        </List.Item>
      </List>
    </Box>
  );
}
