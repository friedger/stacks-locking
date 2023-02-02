import { ClockIcon } from "@components/icons/clock";
import { color, Flex, FlexProps, Text } from "@stacks/ui";
import { addSeconds, formatDistanceToNow } from "date-fns";

interface NextCycleStartTimeProps extends FlexProps {
  /**
   * Time, in seconds, until the start of the next cycle.
   */
  timeUntilNextCycle: number;
}

export function NextCycleStartTime({
  timeUntilNextCycle,
  ...rest
}: NextCycleStartTimeProps) {
  const timeUntilNextCycleText = formatDistanceToNow(
    addSeconds(new Date(), timeUntilNextCycle)
  );
  return (
    <Flex {...rest}>
      <Flex
        width="44px"
        height="44px"
        background={color("bg-4")}
        borderRadius="50%"
        alignItems="center"
        justifyContent="center"
      >
        <ClockIcon size="14px" />
      </Flex>
      <Flex ml="base" flexDirection="column">
        <Text
          as="h4"
          display="block"
          textStyle="body.large.medium"
          lineHeight="20px"
        >
          Next cycle starts in
        </Text>
        <Text
          display="block"
          textStyle="body.large"
          color={color("text-caption")}
          lineHeight="20px"
          mt="extra-tight"
        >
          {timeUntilNextCycleText}
        </Text>
      </Flex>
    </Flex>
  );
}
