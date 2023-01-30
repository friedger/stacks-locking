import { useRef } from "react";

import {
  ActionIcon,
  Group,
  NumberInput,
  NumberInputHandlers,
  Stack,
  Text,
} from "@mantine/core";
import { addSeconds, formatDistance } from "date-fns";
import { useField } from "formik";

import {
  useGetCycleDurationQuery,
  useGetPoxInfoQuery,
} from "@components/stacking-client-provider/stacking-client-provider";
import { MAX_STACKING_CYCLES, MIN_STACKING_CYCLES } from "@constants/app";

import { Description, Step } from "../../components/stacking-form-step";

export function Duration() {
  const [field, , helpers] = useField("lockPeriod");
  const getPoxInfoQuery = useGetPoxInfoQuery();
  const getCycleDurationQuery = useGetCycleDurationQuery();
  const handlers = useRef<NumberInputHandlers>();
  return (
    <Step title="Duration">
      <Stack>
        <Description>
          <Text>
            Every cycle, each of your reward slots will be eligible for rewards.
            After your chosen duration, you’ll need to wait one cycle before you
            can stack from this address again.
          </Text>
        </Description>

        <Group>
          <ActionIcon
            variant="default"
            onClick={() => {
              if (field.value <= MIN_STACKING_CYCLES) {
                helpers.setValue(MIN_STACKING_CYCLES);
                return;
              }

              helpers.setValue(field.value - 1);
            }}
          >
            –
          </ActionIcon>
          <NumberInput
            w="110px"
            hideControls
            value={field.value}
            handlersRef={handlers}
            formatter={(n) => {
              return `${Number(n)} cycle${Number(n) > 1 ? "s" : ""}`;
            }}
          />
          <ActionIcon
            variant="default"
            onClick={() => {
              if (field.value >= MAX_STACKING_CYCLES) {
                helpers.setValue(MAX_STACKING_CYCLES);
                return;
              }

              helpers.setValue(field.value + 1);
            }}
          >
            +
          </ActionIcon>
        </Group>

        <Text>
          Cycles last {getPoxInfoQuery.data?.reward_cycle_length} Bitcoin
          blocks, currently{" "}
          {formatDistance(
            addSeconds(new Date(), getCycleDurationQuery.data ?? 0),
            new Date()
          )}
        </Text>
      </Stack>
    </Step>
  );
}
