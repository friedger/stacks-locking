import { Box, Flex, Text } from '@stacks/ui';

import { Hr } from '@components/hr';
import {
  InfoCardGroup as Group,
  InfoCard,
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardSection as Section,
  InfoCardValue as Value,
} from '@components/info-card';
import { useGetPoxInfoQuery } from '@components/stacking-client-provider/stacking-client-provider';
import { toHumanReadableStx } from '@utils/unit-convert';

export function InfoPanel() {
  const getPoxInfoQuery = useGetPoxInfoQuery();
  if (getPoxInfoQuery.isLoading) return null;
  if (getPoxInfoQuery.isError || !getPoxInfoQuery.data) return <>Failed to load Pox data</>;
  return (
    <InfoCard minHeight="84px">
      <Box mx={['loose', 'extra-loose']}>
        <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
          <Text
            fontSize="24px"
            mt="extra-tight"
            fontWeight={500}
            fontFamily="Open Sauce"
            letterSpacing="-0.02em"
          >
            Cycles
          </Text>
        </Flex>
        <Hr />
        <Group width="100%" mt="base-loose" mb="extra-loose">
          <Section>
            <Row>
              <Label
                explainer={`One cycle lasts ${getPoxInfoQuery.data.reward_cycle_length} blocks on the Bitcoin blockchain`}
              >
                Current Cycle
              </Label>
              <Value>{getPoxInfoQuery.data.current_cycle.id}</Value>
            </Row>
            <Row>
              <Label>Total Stacked</Label>
              <Value>{toHumanReadableStx(getPoxInfoQuery.data.current_cycle.stacked_ustx)}</Value>
            </Row>
            <Row>
              <Label>Per Slot</Label>
              <Value>
                {toHumanReadableStx(getPoxInfoQuery.data.current_cycle.min_threshold_ustx)}
              </Value>
            </Row>
          </Section>

          <Section>
            <Row>
              <Label>Next Cycle</Label>
              <Value>{getPoxInfoQuery.data.next_cycle.id}</Value>
            </Row>
            <Row>
              <Label>Starts in</Label>
              <Value>{getPoxInfoQuery.data.next_cycle.blocks_until_prepare_phase} blocks</Value>
            </Row>
            <Row>
              <Label>Total Stacked</Label>
              <Value>{toHumanReadableStx(getPoxInfoQuery.data.next_cycle.stacked_ustx)}</Value>
            </Row>
            <Row>
              <Label explainer="The price per slot can change until the last block">
                Per Slot (estimated)
              </Label>
              <Value>
                {toHumanReadableStx(getPoxInfoQuery.data.next_cycle.min_threshold_ustx)}
              </Value>
            </Row>
          </Section>
        </Group>
      </Box>
    </InfoCard>
  );
}
