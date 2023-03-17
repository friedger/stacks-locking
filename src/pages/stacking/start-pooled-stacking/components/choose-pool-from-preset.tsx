import { ErrorLabel } from "@components/error-label";
import { ErrorText } from "@components/error-text";
import { Text, Stack } from "@stacks/ui";
import { useField } from "formik";

import { OneCycleDescriptor } from "../../components/one-cycle-descriptor";
import { Description, Step } from "../../components/stacking-form-step";
import { DurationCyclesField } from "./duration-cycles-field";
import { DurationSelectItem } from "./duration-select-item";
import { IndefiniteStackingIcon } from "./indefinite-stacking-icon";
import { LimitedStackingIcon } from "./limited-stacking-icon";

export function ChoosePoolFromPreset() {
  const [fieldPool] = useField("pool");
  const [
    fieldDelegationDurationType,
    metaDelegationDurationType,
    helpersDelegationDurationType,
  ] = useField("delegationDurationType");

  return (
    <Step title="Pool">
      <Description>
        <Text>
          Choose your pool.
        </Text>
      </Description>

      <Stack spacing="base" mt="extra-loose">
        <DurationSelectItem
          title="Indefinite"
          icon={<IndefiniteStackingIcon />}
          delegationType="indefinite"
          activeDelegationType={fieldDelegationDurationType.value}
          onChange={(val) => helpersDelegationDurationType.setValue(val)}
        >
          <Text>
            The pool has indefinite permission to lock your STX for up to 12
            cycles at a time. Revoke manually at any time to prevent further
            locks.
          </Text>
        </DurationSelectItem>
        <DurationSelectItem
          title="Limited"
          delegationType="limited"
          icon={<LimitedStackingIcon cycles={fieldNumberOfCycles.value || 1} />}
          activeDelegationType={fieldDelegationDurationType.value}
          onChange={(val) => helpersDelegationDurationType.setValue(val)}
        >
          <Text>
            Set a limit between 1 and 12 cycles for how long the pool can stack
            on your behalf. The pool will only be able to stack your STX up to
            that limit.
          </Text>
          {fieldDelegationDurationType.value === "limited" && (
            <DurationCyclesField />
          )}
        </DurationSelectItem>
      </Stack>

      {metaDelegationDurationType.touched &&
        metaDelegationDurationType.error && (
          <ErrorLabel mt="base-loose">
            <ErrorText>{metaDelegationDurationType.error}</ErrorText>
          </ErrorLabel>
        )}
    </Step>
  );
}
