import { useMemo } from "react";

import { Box, Card, Divider, Group, Stack, Text, Title } from "@mantine/core";
import { BigNumber } from "bignumber.js";
import { useFormikContext } from "formik";

import { useGetPoxInfoQuery } from "@components/stacking-client-provider/stacking-client-provider";
import { parseNumericalFormInput } from "@utils/form/parse-numerical-form-input";
import { truncateMiddle } from "@utils/tx-utils";
import { stxToMicroStx, toHumanReadableStx } from "@utils/unit-convert";

import {
  calculateRewardSlots,
  calculateStackingBuffer,
} from "../../../utils/calc-stacking-buffer";
import { createAmountText } from "../../../utils/create-amount-text";
import { DirectStackingFormValues } from "../../types";
import { Start } from "./components/start";

export function InfoPanel() {
  const f = useFormikContext<DirectStackingFormValues>();
  const getPoxInfoQuery = useGetPoxInfoQuery();

  const { amount, lockPeriod, poxAddress } = f.values;

  const amountToBeStacked = useMemo(
    () => stxToMicroStx(parseNumericalFormInput(amount)).integerValue(),
    [amount]
  );

  const numberOfRewardSlots = calculateRewardSlots(
    amountToBeStacked,
    new BigNumber(getPoxInfoQuery.data?.min_amount_ustx || 0)
  ).integerValue();

  const buffer = calculateStackingBuffer(
    amountToBeStacked,
    new BigNumber(getPoxInfoQuery.data?.min_amount_ustx || 0)
  );

  return (
    <Card withBorder>
      <Stack>
        <Box>
          <Title order={4}>You'll lock</Title>
          <Text fz={34}>{createAmountText(amount)}</Text>
        </Box>

        <Divider />

        <Group position="apart">
          <Text>Reward slots</Text>
          <Text>{numberOfRewardSlots.toString()}</Text>
        </Group>
        <Group position="apart">
          <Text>Buffer</Text>
          <Text>
            {buffer === null ? "No buffer" : toHumanReadableStx(buffer)}
          </Text>
        </Group>

        <Divider />

        <Group position="apart">
          <Text>Cycles</Text>
          <Text>{lockPeriod}</Text>
        </Group>
        <Start />

        <Divider />

        <Group position="apart">
          <Text>Bitcoin address</Text>
          <Text>{poxAddress ? truncateMiddle(poxAddress) : "—"}</Text>
        </Group>
      </Stack>
    </Card>
  );
}
