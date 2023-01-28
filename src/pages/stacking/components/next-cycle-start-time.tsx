import { Avatar, Box, Flex, Text, Title } from "@mantine/core";
import { IconClockHour3 } from "@tabler/icons-react";
import { addSeconds, formatDistanceToNow } from "date-fns";

interface NextCycleStartTimeProps {
  /**
   * Time, in seconds, until the start of the next cycle.
   */
  timeUntilNextCycle: number;
}

export function NextCycleStartTime({
  timeUntilNextCycle,
}: NextCycleStartTimeProps) {
  const timeUntilNextCycleText = formatDistanceToNow(
    addSeconds(new Date(), timeUntilNextCycle)
  );
  return (
    <Flex gap="sm">
      <Avatar radius="xl">
        <IconClockHour3 size="14px" />
      </Avatar>
      <Box>
        <Title order={4}>Next cycle starts in</Title>
        <Text>{timeUntilNextCycleText}</Text>
      </Box>
    </Flex>
  );
}
