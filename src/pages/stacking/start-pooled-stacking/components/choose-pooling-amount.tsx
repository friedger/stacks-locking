import { Anchor, Stack, Text } from "@mantine/core";
import { useField } from "formik";

import { microStxToStx, toHumanReadableStx } from "@utils/unit-convert";

import { AmountField } from "../../components/fields/amount-field";
import { Description, Step } from "../../components/stacking-form-step";

interface Props {
  availableBalance: bigint;
}
export function ChoosePoolingAmount({ availableBalance }: Props) {
  const helpers = useField("amount")[2];
  return (
    <Step title="Amount">
      <Stack>
        <Description>
          <Text>
            Choose how much you&apos;ll pool. Your pool may require a minimum.
          </Text>
        </Description>

        <AmountField placeholder="Amount of STX to Stack" />
        <Text>
          Available balance:{" "}
          <Anchor
            component="button"
            type="button"
            onClick={() =>
              helpers.setValue(microStxToStx(availableBalance).toString())
            }
          >
            {toHumanReadableStx(availableBalance)}
          </Anchor>
        </Text>
      </Stack>
    </Step>
  );
}
