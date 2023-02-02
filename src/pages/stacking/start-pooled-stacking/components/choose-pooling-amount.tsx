import { useField } from "formik";

import { microStxToStx, toHumanReadableStx } from "@utils/unit-convert";

import { Description, Step } from "../../components/stacking-form-step";

import { Box, Button, color, Input, Text } from "@stacks/ui";
import { ErrorLabel } from "@components/error-label";
import { ErrorText } from "@components/error-text";

interface Props {
  availableBalance: bigint;
}
export function ChoosePoolingAmount({ availableBalance }: Props) {
  const [field, meta, helpers] = useField("amount");
  return (
    <Step title="Amount">
      <Description>
        <Text>
          Choose how much you&apos;ll pool. Your pool may require a minimum.
        </Text>
      </Description>

      <Box position="relative" maxWidth="400px">
        <Input
          id="stxAmount"
          mt="loose"
          placeholder="Amount of STX to Stack"
          {...field}
        />
        {meta.touched && meta.error && (
          <ErrorLabel>
            <ErrorText>{meta.error}</ErrorText>
          </ErrorLabel>
        )}
      </Box>

      <Box textStyle="body.small" color={color("text-caption")} mt="base-tight">
        Available balance:{" "}
        <Button
          variant="link"
          type="button"
          onClick={() => helpers.setValue(microStxToStx(availableBalance))}
        >
          {toHumanReadableStx(availableBalance)}
        </Button>
      </Box>
    </Step>
  );
}
