import { useField } from "formik";
import { Text } from "@stacks/ui";

import { MAX_STACKING_CYCLES, MIN_STACKING_CYCLES } from "@constants/app";

import { Description, Step } from "../../components/stacking-form-step";
import { Stepper } from "../../components/stepper";
import { OneCycleDescriptor } from "../../components/one-cycle-descriptor";
import { ErrorLabel } from "@components/error-label";
import { ErrorText } from "@components/error-text";

export function Duration() {
  const [field, meta, helpers] = useField("lockPeriod");
  return (
    <>
      <Step title="Duration">
        <Description>
          <Text>
            Every cycle, each of your reward slots will be eligible for rewards.
            After your chosen duration, you’ll need to wait one cycle before you
            can stack from this address again.
          </Text>
        </Description>

        <Stepper
          mt="loose"
          amount={field.value}
          onIncrement={(cycle) => {
            if (cycle > MAX_STACKING_CYCLES) return;
            helpers.setValue(cycle);
          }}
          onDecrement={(cycle) => {
            if (cycle < MIN_STACKING_CYCLES) return;
            helpers.setValue(cycle);
          }}
        />
        <OneCycleDescriptor mt="loose" />
        {meta.touched && meta.error && (
          <ErrorLabel>
            <ErrorText>{meta.error}</ErrorText>
          </ErrorLabel>
        )}
      </Step>
    </>
  );
}
