import { useField } from "formik";

import { Description, Step } from "../../components/stacking-form-step";

import { Box, color, Input, Text } from "@stacks/ui";
import { ErrorLabel } from "@components/error-label";
import { ErrorText } from "@components/error-text";

interface Props {
  editable: boolean;
  btcAddress: string;
}
export function ChoosePoolingRewardAddress({ btcAddress, editable }: Props) {
  const [field, meta, helpers] = useField("btcAddress");
  return (
    <Step title="Reward address">
      <Description>
        <Text>
          Choose how you would like to receive your stacking rewards. Your pool
          might require to use your own Bitcoin address only.
        </Text>
      </Description>

      <Box position="relative" maxWidth="400px">
        <Input
          id="btcAddress"
          mt="loose"
          placeholder="A Bitcoin address"
          isDisabled={!editable}
          {...field}
        />
        {meta.touched && meta.error && (
          <ErrorLabel>
            <ErrorText>{meta.error}</ErrorText>
          </ErrorLabel>
        )}
      </Box>

      <Box textStyle="body.small" color={color("text-caption")} mt="base-tight">
        Choose from your BTC addresses:..
      </Box>
    </Step>
  );
}
