import { Box, Button, Flex, Stack, Text } from '@stacks/ui';

import { InfoCard } from '@components/info-card';

interface IncreasePoolingAmountProps {
  handleKeepPoolingClick: () => void;
  handleStopPoolingClick: () => void;
}
export function IncreasePoolingAmount({
  handleKeepPoolingClick,
  handleStopPoolingClick,
}: IncreasePoolingAmountProps) {
  return (
    <InfoCard>
      <Box mx={['loose', 'extra-loose']}>
        <Flex flexDirection="column" pt="loose" pb="base-loose">
          <Text textStyle="body.large.medium">Increase pooling amount</Text>

          <Text py="loose">
            To increase the amount of STX you must first stop the current pool and start pooling
            again, your pool operator can then lock a higher amount for the next cycles.
          </Text>
          <Stack>
            <Button mode="tertiary" onClick={handleKeepPoolingClick}>
              Keep pooling
            </Button>
            <Button onClick={handleStopPoolingClick}>I understand I want to stop pooling</Button>
          </Stack>
        </Flex>
      </Box>
    </InfoCard>
  );
}
