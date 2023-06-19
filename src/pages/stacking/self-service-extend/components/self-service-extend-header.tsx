import { StackerInfo } from '@stacks/stacking';
import { Flex, Text } from '@stacks/ui';

import { toHumanReadableStx } from '@utils/unit-convert';

export function SelfServiceExtendHeader({
  stackerInfoDetails,
  showExtendForOtherUser,
  lockedBalance,
}: {
  stackerInfoDetails: (StackerInfo & { stacked: true })['details'] | undefined;
  showExtendForOtherUser: boolean;
  lockedBalance: bigint;
}) {
  return (
    <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
      {stackerInfoDetails && !showExtendForOtherUser ? (
        <>
          <Text textStyle="body.large.medium">You&apos;re stacking</Text>
          <Text
            fontSize="24px"
            fontFamily="Open Sauce"
            fontWeight={500}
            letterSpacing="-0.02em"
            mt="extra-tight"
          >
            {toHumanReadableStx(lockedBalance)}
          </Text>
        </>
      ) : (
        <>
          <Text textStyle="body.large.medium">Self-service pooling with</Text>
          <Text
            fontSize="24px"
            fontFamily="Open Sauce"
            fontWeight={500}
            letterSpacing="-0.02em"
            mt="extra-tight"
          >
            Fast Pool
          </Text>
        </>
      )}
    </Flex>
  );
}
