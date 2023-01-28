import { useMemo } from "react";

import { Box, Flex, Group, Loader, Text } from "@mantine/core";
import { StackingClient } from "@stacks/stacking";
import { useQuery } from "@tanstack/react-query";
import { addSeconds, formatDistanceToNow } from "date-fns";
import { useField } from "formik";

import { CircleButton } from "@components/circle-button";
import { ErrorAlert } from "@components/error-alert";
import {
  useGetCycleDurationQuery,
  useStackingClient,
} from "@components/stacking-client-provider/stacking-client-provider";
import { MAX_STACKING_CYCLES, MIN_STACKING_CYCLES } from "@constants/app";
import { decrement, increment } from "@utils/mutate-numbers";
import { formatCycles } from "@utils/stacking";

const createCycleArray = () => new Array(12).fill(null).map((_, i) => i + 1);
const durationWithDefault = (duration: number | null) => duration ?? 1;

interface DurationCyclesFieldInnerProps {
  client: StackingClient;
}
function DurationCyclesFieldInner({ client }: DurationCyclesFieldInnerProps) {
  const q = useGetCycleDurationQuery();
  const [cyclesField, _meta, durationLengthHelpers] =
    useField("numberOfCycles");
  const duration = cyclesField.value ?? 1;

  const cycleLabels = useMemo(() => {
    if (typeof q.data !== "number") return [];
    return createCycleArray().map(
      (c) =>
        `${formatCycles(c)} ends in about ${formatDistanceToNow(
          addSeconds(new Date(), c * q.data)
        )}`
    );
  }, [q.data]);

  if (q.isLoading) return <Loader />;
  if (typeof q.data !== "number") {
    const msg = "Expected `data` to be a number.";
    console.error(msg);
    <ErrorAlert>{msg}</ErrorAlert>;
  }
  if (typeof duration !== "number") {
    const msg = "Expected `duration` to be a number.";
    console.error(msg);
    <ErrorAlert>{msg}</ErrorAlert>;
  }

  return (
    <Flex
      align="center"
      justify="space-between"
      mt="base"
      p="8px"
      sx={(t) => ({
        boxShadow: "low",
        border: `1px solid ${t.colors.gray[5]}`,
        borderRadius: t.radius.xs,
        position: "relative",
        zIndex: 10,
      })}
      onClick={(e) => (e.stopPropagation(), e.preventDefault())}
    >
      <Text>{cycleLabels[duration - 1]}</Text>
      <Group spacing="xs">
        <CircleButton
          onClick={(e) => {
            e.stopPropagation();
            durationLengthHelpers.setValue(
              Math.max(
                MIN_STACKING_CYCLES,
                decrement(durationWithDefault(duration))
              )
            );
          }}
        >
          -
        </CircleButton>
        <CircleButton
          onClick={(e) => {
            e.stopPropagation();
            durationLengthHelpers.setValue(
              Math.min(
                MAX_STACKING_CYCLES,
                increment(durationWithDefault(duration))
              )
            );
          }}
        >
          +
        </CircleButton>
      </Group>
    </Flex>
  );
}

export function DurationCyclesField() {
  const { client } = useStackingClient();
  if (!client) {
    const msg = "Expected `client` to be defined.";
    console.error(msg);
    return <ErrorAlert>{msg}</ErrorAlert>;
  }
  return <DurationCyclesFieldInner client={client} />;
}
