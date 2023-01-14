import { ClockIcon } from '@components/icons/clock';
import { Avatar, Text, Flex, Stack, Title, Box } from '@mantine/core';

interface NextCycleStartTimeProps {
  nextCycleStartsIn: string;
}

export function NextCycleStartTime(props: NextCycleStartTimeProps) {
  const { nextCycleStartsIn } = props;
  return (
    <Flex gap="sm">
      <Avatar radius="xl">
        <ClockIcon size="14px" />
      </Avatar>
      <Box>
        <Title
          order={4}
          /* as="h4" display="block" textStyle="body.large.medium" lineHeight="20px" */
        >
          Next cycle starts in
        </Title>
        <Text
        /* display="block" */
        /* textStyle="body.large" */
        /* color={color('text-caption')} */
        /* lineHeight="20px" */
        /* mt="extra-tight" */
        >
          {nextCycleStartsIn}
        </Text>
      </Box>
    </Flex>
  );
}
