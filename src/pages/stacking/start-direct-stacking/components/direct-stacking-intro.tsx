import { Group, Text } from "@mantine/core";

import { Title } from "@components/title";

import { EstimatedMinimumLabel } from "../../components/estimated-minimum-label";
import { NextCycleStartTime } from "../../components/next-cycle-start-time";

interface StackingIntroProps {
  /**
   * Time, in seconds, until the start of the next cycle.
   */
  timeUntilNextCycle: number;

  /**
   * Extimated amount of uSTX needed to start stacking.
   */
  estimatedStackingMinimum: bigint;
}
export function DirectStackingIntro(props: StackingIntroProps) {
  const { timeUntilNextCycle, estimatedStackingMinimum } = props;
  return (
    <>
      <Title>Stack by yourself</Title>
      <Text>
        When you stack by yourself, you’ll get the chance to earn Bitcoin each
        cycle for every reward slot that you hold.
      </Text>
      <Text>
        The STX required per reward slot can fluctuate from cycle to cycle. If
        you’re close to the current minimum, consider pooling instead to help
        make sure you don’t end up without rewards.
      </Text>
      <Group spacing="xl">
        <NextCycleStartTime timeUntilNextCycle={timeUntilNextCycle} />
        <EstimatedMinimumLabel
          estimatedStackingMinimum={estimatedStackingMinimum}
        />
      </Group>
    </>
  );
}
