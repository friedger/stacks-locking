import { Box, Flex, Text } from '@stacks/ui';
import { useFormikContext } from 'formik';

import { Hr } from '@components/hr';
import {
  InfoCardGroup as Group,
  InfoCard,
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardSection as Section,
  InfoCardValue as Value,
} from '@components/info-card';
import { truncateMiddle } from '@utils/tx-utils';

import { StackAggregationCommitFormValues } from '../types';

export function InfoPanel() {
  const f = useFormikContext<StackAggregationCommitFormValues>();

  const { rewardCycleId, poxAddress } = f.values;

  return (
    <InfoCard minHeight="84px">
      <Box mx={['loose', 'extra-loose']}>
        <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
          <Text textStyle="body.large.medium">You&apos;ll finalize</Text>
          <Text
            fontSize="24px"
            mt="extra-tight"
            fontWeight={500}
            fontFamily="Open Sauce"
            letterSpacing="-0.02em"
          >
            Cycle {rewardCycleId}
          </Text>
        </Flex>
        <Hr />
        <Group width="100%" mt="base-loose" mb="extra-loose">
          <Section>
            <Row>
              <Label>Pool PoX address</Label>
              <Value>{poxAddress ? truncateMiddle(poxAddress) : '—'}</Value>
            </Row>
          </Section>
        </Group>
      </Box>
    </InfoCard>
  );
}
