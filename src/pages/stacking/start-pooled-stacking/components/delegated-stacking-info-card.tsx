import {
  InfoCard,
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardGroup as Group,
  InfoCardValue as Value,
  InfoCardSection as Section,
} from "@components/info-card";
import { useFormikContext } from "formik";

import { useGetPoxInfoQuery } from "@components/stacking-client-provider/stacking-client-provider";
import { cyclesToBurnChainHeight } from "@utils/calculate-burn-height";
import { formatCycles } from "@utils/stacking";
import { truncateMiddle } from "@utils/tx-utils";

import { createAmountText } from "../../utils/create-amount-text";
import { EditingFormValues } from "../types";
import { Box, Flex, FlexProps, Text, Tooltip } from "@stacks/ui";
import { Hr } from "@components/hr";
import { IconQuestionCircle } from "@tabler/icons-react";

export function PoolingInfoCard(props: FlexProps) {
  const f = useFormikContext<EditingFormValues>();
  const poxInfoQuery = useGetPoxInfoQuery();

  const amount = f.values.amount;
  const delegationType = f.values.delegationDurationType;
  const poolStxAddress = f.values.poolAddress;
  const durationInCycles =
    f.values.delegationDurationType === "limited"
      ? f.values.numberOfCycles
      : null;

  const burnHeight =
    durationInCycles && poxInfoQuery.data
      ? cyclesToBurnChainHeight({
          cycles: durationInCycles,
          rewardCycleLength: poxInfoQuery.data.reward_cycle_length,
          currentCycleId: poxInfoQuery.data.current_cycle.id,
          firstBurnchainBlockHeight:
            poxInfoQuery.data.first_burnchain_block_height,
        })
      : null;
  const amountText = createAmountText(amount);

  return (
    <>
      <InfoCard {...props}>
        <Box mx={["loose", "extra-loose"]} sx={{ border: "1px solid red" }}>
          <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
            <Text textStyle="body.large.medium">You&apos;re pooling</Text>
            <Text
              fontSize="24px"
              fontFamily="Open Sauce"
              fontWeight={500}
              letterSpacing="-0.02em"
              mt="extra-tight"
            >
              {amountText}
            </Text>
          </Flex>

          <Hr />

          <Group mt="base-loose" mb="extra-loose">
            <Section>
              <Row>
                <Label>
                  Duration
                  <Tooltip label="How long you want to delegate to the pool. This is not necessarily the locking duration. However, the locking period cannot be longer than the delegation duration.">
                    <span>
                      <IconQuestionCircle height="1rem" width="1rem" />
                    </span>
                  </Tooltip>
                </Label>
                <Value>
                  {!delegationType && "—"}
                  {delegationType === "limited" &&
                    formatCycles(durationInCycles ?? 0)}
                  {delegationType === "indefinite" && "Indefinite"}
                </Value>
              </Row>
            </Section>

            <Section>
              <Row>
                <Label explainer=" How long you want to delegate to the pool. This is not necessarily the locking duration. However, the locking period cannot be longer than the delegation duration.">
                  Type
                </Label>
                <Value>
                  {delegationType === null && "—"}
                  {delegationType === "limited" &&
                    formatCycles(durationInCycles ?? 0)}
                  {delegationType === "indefinite" && "Indefinite"}
                </Value>
              </Row>

              {burnHeight && (
                <Row>
                  <Label>Burn height</Label>
                  <Value>{burnHeight}</Value>
                </Row>
              )}
            </Section>

            <Section>
              <Row>
                <Label explainer="This address is provided to you by your chosen pool for Stacking delegation specifically.">
                  Pool address
                </Label>
                <Value>
                  {poolStxAddress ? truncateMiddle(poolStxAddress) : "—"}
                </Value>
              </Row>
              <Row>
                <Label>Contract</Label>
                <Value>
                  {truncateMiddle(poxInfoQuery.data?.contract_id ?? "")}
                </Value>
              </Row>
            </Section>
          </Group>
        </Box>
      </InfoCard>
    </>
  );
}
