import { StackProps, Text } from "@stacks/ui";
import { IconLock } from "@tabler/icons-react";
import { Stack } from "@stacks/ui";

import { pseudoBorderLeft } from "@components/styles/pseudo-border-left";
import { StackingTermItem } from "../../components/stacking-term";
import { StepsIcon } from "@components/icons/steps";

export function DelegatedStackingTerms(props: StackProps) {
  return (
    <Stack
      textStyle={["body.small", "body.large"]}
      spacing="base-loose"
      pl="base"
      {...pseudoBorderLeft("feedback-alert")}
      {...props}
    >
      <StackingTermItem
        title="This transaction can’t be reversed"
        icon={<IconLock width="16px" height="16px" />}
      >
        <Text>
          There will be no way to unlock your STX once the pool has started
          stacking them. You will need to wait until they unlock at the end of
          the pool&apos;s chosen number of cycles.
        </Text>
      </StackingTermItem>
      <StackingTermItem
        title="Research your pool"
        icon={<StepsIcon width="16px" height="16px" />}
      >
        <Text>
          Paying out rewards is at the discretion of the pool. Make sure you’ve
          researched and trust the pool you’re using. All pools are unaffiliated
          with Hiro PBC.
        </Text>
      </StackingTermItem>
    </Stack>
  );
}
