import { Stack, Text } from "@mantine/core";
import { useField } from "formik";

import { OneCycleDescriptor } from "../../components/one-cycle-descriptor";
import { Description, Step } from "../../components/stacking-form-step";
import { DurationCyclesField } from "./duration-cycles-form";
import { DurationSelectItem } from "./duration-select-item";
import { IndefiniteStackingIcon } from "./indefinite-stacking-icon";
import { LimitedStackingIcon } from "./limited-stacking-icon";

export function ChoosePoolingDuration() {
  const [fieldNumberOfCycles] = useField("numberOfCycles");
  const [
    fieldDelegationDurationType,
    metaDelegationDurationType,
    helpersDelegationDurationType,
  ] = useField("delegationDurationType");

  return (
    <Step title="Duration">
      <Stack>
        <Description>
          <Text>
            Choose whether you want to pool with a limited duration, or give the
            pool indefinite permission. If you set a limit, make sure you don’t
            set it lower than the number of cycles your pool intends to stack.
          </Text>
        </Description>

        <DurationSelectItem
          title="Limited"
          delegationType="limited"
          icon={<LimitedStackingIcon cycles={fieldNumberOfCycles.value || 1} />}
          activeDelegationType={fieldDelegationDurationType.value}
          onChange={(val) => helpersDelegationDurationType.setValue(val)}
        >
          <Text c="dimmed">
            Set a limit between 1 and 12 cycles for how long the pool can stack
            on your behalf. The pool will only be able to stack your STX up to
            that limit.
          </Text>
          {fieldDelegationDurationType.value === "limited" && (
            <DurationCyclesField />
          )}
        </DurationSelectItem>
        <DurationSelectItem
          title="Indefinite"
          icon={<IndefiniteStackingIcon />}
          delegationType="indefinite"
          activeDelegationType={fieldDelegationDurationType.value}
          onChange={(val) => helpersDelegationDurationType.setValue(val)}
        >
          <Text c="dimmed">
            The pool has indefinite permission to lock your STX for up to 12
            cycles at a time. Revoke manually at any time to prevent further
            locks.
          </Text>
        </DurationSelectItem>
        <OneCycleDescriptor mt="loose" />
        {metaDelegationDurationType.touched &&
          metaDelegationDurationType.error && (
            <Text c="red" fz="xs" mt="-12px">
              {metaDelegationDurationType.error}
            </Text>
          )}
      </Stack>
    </Step>
  );
}
