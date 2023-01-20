import { ClockIcon } from '@components/icons/clock';
import { Avatar, Text, Flex, Title, Box } from '@mantine/core';
import { formatDistanceToNow, addSeconds } from 'date-fns';

interface NextCycleStartTimeProps {
  /**
   * Time, in seconds, until the start of the next cycle.
   */
  timeUntilNextCycle: number;
}

export function NextCycleStartTime({ timeUntilNextCycle }: NextCycleStartTimeProps) {
  const timeUntilNextCycleText = formatDistanceToNow(addSeconds(new Date(), timeUntilNextCycle));
  return (
    <Flex gap="sm">
      <Avatar radius="xl">
        <ClockIcon size="14px" />
      </Avatar>
      <Box>
        <Title order={4}>Next cycle starts in</Title>
        <Text>{timeUntilNextCycleText}</Text>
      </Box>
    </Flex>
  );
}
