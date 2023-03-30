import { Box, Flex, Text } from '@stacks/ui';
import { useFormikContext } from 'formik';

import { Address } from '@components/address';
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
import { truncateMiddle } from '@utils/tx-utils';

import { createAmountText } from '../../../utils/create-amount-text';
import { DelegateStackStxFormValues } from '../types';

export function InfoPanel() {
  const f = useFormikContext<DelegateStackStxFormValues>();
  const getPoxInfoQuery = useGetPoxInfoQuery();

  const { stacker, amount, lockPeriod, poxAddress, startBurnHt } = f.values;

  return (
    <InfoCard minHeight="84px">
      <Box mx={['loose', 'extra-loose']}>
        <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
          <Text textStyle="body.large.medium">You&apos;ll lock</Text>
          <Text
            fontSize="24px"
            mt="extra-tight"
            fontWeight={500}
            fontFamily="Open Sauce"
            letterSpacing="-0.02em"
          >
            {createAmountText(amount ?? 0)} for
          </Text>
          <Address address={stacker} />
        </Flex>
        <Hr />
        <Group width="100%" mt="base-loose" mb="extra-loose">
          <Section>
            <Row>
              <Label
                explainer={`One cycle lasts ${getPoxInfoQuery.data?.reward_cycle_length} blocks on the Bitcoin blockchain`}
              >
                Cycles
              </Label>
              <Value>{lockPeriod}</Value>
            </Row>
          </Section>

          <Section>
            <Row>
              <Label>Start Burn Height</Label>
              <Value>{startBurnHt}</Value>
            </Row>
          </Section>

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
