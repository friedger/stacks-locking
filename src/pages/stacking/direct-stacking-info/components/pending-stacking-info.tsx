import { Box, Flex, Text } from '@stacks/ui';
import { IconClockHour4 } from '@tabler/icons-react';

import { Address } from '@components/address';
import { Alert, AlertText } from '@components/alert';
import { OpenExternalLinkInNewTab } from '@components/external-link';
import { Hr } from '@components/hr';
import {
  InfoCardGroup as Group,
  InfoCard,
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardSection as Section,
  InfoCardValue as Value,
} from '@components/info-card';
import { makeExplorerTxLink } from '@utils/external-links';
import { toHumanReadableStx } from '@utils/unit-convert';

import { ReturnGetHasPendingDirectStacking } from '../get-has-pending-direct-stacking';

interface Props {
  data: ReturnGetHasPendingDirectStacking;
  transactionId: string | undefined;
  networkName: string;
}
export function PendingStackingInfo({ data, transactionId, networkName }: Props) {
  return (
    <>
      <Flex height="100%" justify="center" align="center">
        <InfoCard width="420px">
          <Box mx={['loose', 'extra-loose']}>
            <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
              <Text textStyle="body.large.medium">You&apos;re stacking</Text>
              <Text
                fontSize="24px"
                fontFamily="Open Sauce"
                fontWeight={500}
                letterSpacing="-0.02em"
                mt="extra-tight"
                pb="base-loose"
              >
                {toHumanReadableStx(data.amountMicroStx)}
              </Text>

              <Box pb="base-loose">
                <Alert icon={<IconClockHour4 />} title="Waiting for transaction confirmation">
                  <AlertText>
                    A stacking request was successfully submitted to the blockchain. Once confirmed,
                    the account will be ready to start stacking.
                  </AlertText>
                </Alert>
              </Box>

              <Hr />

              <Group mt="base-loose">
                <Section>
                  <Row>
                    <Label>Duration</Label>
                    <Value>{data.lockPeriod.toString()} cycles</Value>
                  </Row>
                  <Row>
                    <Label>Bitcoin address</Label>
                    <Value>
                      <Address address={data.poxAddress} />
                    </Value>
                  </Row>
                </Section>
                <Section>
                  <Row>
                    {transactionId && (
                      <OpenExternalLinkInNewTab
                        href={makeExplorerTxLink(transactionId, networkName)}
                      >
                        View transaction
                      </OpenExternalLinkInNewTab>
                    )}
                  </Row>
                </Section>
              </Group>
            </Flex>
          </Box>
        </InfoCard>
      </Flex>
    </>
  );
}
