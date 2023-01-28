import { Avatar, Box, Flex, Text, Title } from "@mantine/core";
import { IconStairs } from "@tabler/icons-react";

import { toHumanReadableStx } from "@utils/unit-convert";

interface EstimatedMinimumLabelProps {
  /**
   * Extimated amount of uSTX needed to start stacking.
   */
  estimatedStackingMinimum: bigint;
}
export function EstimatedMinimumLabel({
  estimatedStackingMinimum,
}: EstimatedMinimumLabelProps) {
  return (
    <Flex gap="sm">
      <Avatar radius="xl">
        <IconStairs />
      </Avatar>
      <Box>
        <Title order={4}>Estimated minimum</Title>
        <Text>{toHumanReadableStx(estimatedStackingMinimum)}</Text>
      </Box>
    </Flex>
  );
}
