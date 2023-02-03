import {
  InfoCard,
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardGroup as Group,
  InfoCardValue as Value,
  InfoCardSection as Section,
} from "@components/info-card";
import { IconClockHour4, IconInfoCircle } from "@tabler/icons-react";
import { Link } from "react-router-dom";

import { Address } from "@components/address";
import { ErrorAlert } from "@components/error-alert";
import { ExternalLink } from "@components/external-link";
import { useNetwork } from "@components/network-provider";
import {
  useGetAccountBalanceLocked,
  useGetAccountExtendedBalancesQuery,
  useGetCoreInfoQuery,
  useGetPoxInfoQuery,
  useGetStatusQuery,
} from "@components/stacking-client-provider/stacking-client-provider";
import {
  makeExplorerTxLink,
  makeStackingClubRewardAddressLink,
} from "@utils/external-links";
import { formatPoxAddressToNetwork } from "@utils/stacking";
import { toHumanReadableStx } from "@utils/unit-convert";

import { useGetHasPendingDirectStackingQuery } from "./use-get-has-pending-direct-stacking";
import { Box, Flex, Spinner, Stack, Text } from "@stacks/ui";
import { Alert } from "@components/alert";
import { Caption } from "@components/typography";
import { Hr } from "@components/hr";

export function DirectStackingInfo() {
  const { networkName } = useNetwork();
  const getStatusQuery = useGetStatusQuery();
  const getAccountExtendedBalancesQuery = useGetAccountExtendedBalancesQuery();
  const getCoreInfoQuery = useGetCoreInfoQuery();
  const getAccountBalanceLockedQuery = useGetAccountBalanceLocked();
  const getPoxInfoQuery = useGetPoxInfoQuery();
  const getHasPendingDirectStacking = useGetHasPendingDirectStackingQuery();

  if (
    getStatusQuery.isLoading ||
    getAccountExtendedBalancesQuery.isLoading ||
    getCoreInfoQuery.isLoading ||
    getPoxInfoQuery.isLoading ||
    getAccountBalanceLockedQuery.isLoading ||
    getHasPendingDirectStacking.isLoading
  ) {
    return <Spinner />;
  }

  if (
    getStatusQuery.isError ||
    !getStatusQuery.data ||
    getAccountExtendedBalancesQuery.isError ||
    !getAccountExtendedBalancesQuery.data ||
    getAccountBalanceLockedQuery.isError ||
    typeof getAccountBalanceLockedQuery.data !== "bigint" ||
    getCoreInfoQuery.isError ||
    !getCoreInfoQuery.data ||
    getPoxInfoQuery.isError ||
    !getPoxInfoQuery.data ||
    getHasPendingDirectStacking.isError ||
    getHasPendingDirectStacking.data === undefined
  ) {
    const msg = "Error while loading data, try reloading the page.";
    console.error(msg);
    return (
      <ErrorAlert id="0abc083b-06c7-4795-8491-68264595f1b4">
        <Text>{msg}</Text>
      </ErrorAlert>
    );
  }

  const isStacking = getStatusQuery.data.stacked;

  if (!isStacking && getHasPendingDirectStacking.data === null) {
    return (
      <Flex justify="center" align="center">
        <InfoCard width="420px">
          <Alert icon={<IconInfoCircle />}>
            <Stack>
              <Text>
                It appears that you&apos;re not stacking yet. If you recently
                started to stack, your stacking info will appear here in a few
                seconds.
              </Text>
              <Text>
                You may want to{" "}
                <Caption
                  display="inline"
                  to="../start-direct-stacking"
                  component={Link}
                >
                  start stacking
                </Caption>{" "}
                or{" "}
                <Caption
                  display="inline"
                  to="../choose-stacking-method"
                  component={Link}
                >
                  choose your stacking method
                </Caption>
                .
              </Text>
            </Stack>
          </Alert>
        </InfoCard>
      </Flex>
    );
  }

  const transactionId = getHasPendingDirectStacking.data?.transactionId;

  if (!isStacking && getHasPendingDirectStacking.data) {
    return (
      <>
        <Flex justify="center" align="center">
          <InfoCard width="420px">
            <Box mx={["loose", "extra-loose"]}>
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
                  {toHumanReadableStx(
                    getHasPendingDirectStacking.data.amountMicroStx
                  )}
                </Text>

                <Box pb="base-loose">
                  <Alert
                    icon={<IconClockHour4 />}
                    title="Waiting for transaction confirmation"
                  >
                    A stacking request was successfully submitted to the
                    blockchain. Once confirmed, the account will be ready to
                    start stacking.
                  </Alert>
                </Box>

                <Hr />

                <Group mt="base-loose">
                  <Section>
                    <Row>
                      <Label>Duration</Label>
                      <Value>
                        {getHasPendingDirectStacking.data.lockPeriod.toString()}{" "}
                        cycles
                      </Value>
                    </Row>
                  </Section>
                  <Section>
                    <Row>
                      <Label>Bitcoin address</Label>
                      <Value>
                        <Address
                          address={getHasPendingDirectStacking.data.poxAddress}
                        />
                      </Value>
                    </Row>
                  </Section>
                  <Section>
                    <Row>
                      {transactionId && (
                        <ExternalLink
                          href={makeExplorerTxLink(transactionId, networkName)}
                        >
                          View transaction
                        </ExternalLink>
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

  // This if statement may be unnecessary, as cases for when the account is not stacked should have
  // already been handled above, but the type system can not guarantee this.
  if (!getStatusQuery.data.stacked) {
    const id = "ee504e56-9cc5-49b4-ae98-a5cac5c35dbf";
    const msg = "Expected account to be stacked";
    console.error(id, msg);
    return <ErrorAlert id={id}>{msg}</ErrorAlert>;
  }

  const elapsedCyclesSinceStackingStart = Math.max(
    getPoxInfoQuery.data.reward_cycle_id -
      getStatusQuery.data.details.first_reward_cycle,
    0
  );
  const elapsedStackingCycles = Math.min(
    elapsedCyclesSinceStackingStart,
    getStatusQuery.data.details.lock_period
  );

  const isBeforeFirstRewardCycle =
    getPoxInfoQuery.data.reward_cycle_id <
    getStatusQuery.data.details.first_reward_cycle;

  const poxAddress = formatPoxAddressToNetwork(
    getStatusQuery.data.details.pox_address
  );

  return (
    <>
      <Flex justify="center" align="center">
        <InfoCard width="420px">
          <Box mx={["loose", "extra-loose"]}>
            <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
              <Text textStyle="body.large.medium">You&apos;re stacking</Text>
              <Text
                fontSize="24px"
                fontFamily="Open Sauce"
                fontWeight={500}
                letterSpacing="-0.02em"
                mt="extra-tight"
              >
                {toHumanReadableStx(getAccountBalanceLockedQuery.data)}
              </Text>

              {isBeforeFirstRewardCycle && (
                <>
                  <Box pb="base-loose"></Box>
                  <Alert
                    icon={<IconClockHour4 />}
                    title="Waiting for the cycle to start"
                  >
                    Your STX are ready for stacking. Once the next cycle starts
                    the network will determine if and how many slots are
                    claimed.
                  </Alert>
                </>
              )}

              <Box pb="base-loose"></Box>

              <Hr />
              <Group pt="base-loose">
                <Section>
                  <Row>
                    <Label>Duration</Label>
                    <Value>
                      {elapsedStackingCycles} /{" "}
                      {getStatusQuery.data.details.lock_period}
                    </Value>
                  </Row>
                  <Row>
                    <Label>Start</Label>
                    <Value>
                      Cycle {getStatusQuery.data.details.first_reward_cycle}
                    </Value>
                  </Row>
                  <Row>
                    <Label>End</Label>
                    <Value>
                      Cycle{" "}
                      {getStatusQuery.data.details.first_reward_cycle +
                        getStatusQuery.data.details.lock_period}{" "}
                    </Value>
                  </Row>
                </Section>

                {poxAddress && (
                  <Section>
                    <Row>
                      <Label>Bitcoin address</Label>
                      <Value>
                        <Address address={poxAddress} />
                      </Value>
                    </Row>
                  </Section>
                )}

                <Section>
                  <ExternalLink
                    href={makeStackingClubRewardAddressLink(
                      String(
                        formatPoxAddressToNetwork(
                          getStatusQuery.data.details.pox_address
                        )
                      )
                    )}
                  >
                    🥞 View on stacking.club
                  </ExternalLink>
                </Section>
              </Group>
            </Flex>
          </Box>
        </InfoCard>
      </Flex>
    </>
  );
}
