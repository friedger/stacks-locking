import { Loader, Stack, Text } from "@mantine/core";
import { PoxOperationPeriod } from "@stacks/stacking/dist/constants";
import { useField } from "formik";

import { ErrorAlert } from "@components/error-alert";
import { useGetPoxOperationInfo } from "@components/stacking-client-provider/stacking-client-provider";

import { AddressField } from "../../../components/fields/address-field";
import { Step } from "../../../components/stacking-form-step";
import { ErrorPeriod1, ErrorPostPeriod1 } from "./components/errors";

export function PoxAddress() {
  const meta = useField("poxAddress")[1];
  const q = useGetPoxOperationInfo();

  if (q.isLoading) return <Loader />;
  if (q.isError || !q.data) {
    const id = "e69b0abe-495d-4587-9693-8bd4541dddaf";
    const msg = "Failed to establish current PoX period.";
    console.error(id, msg);
    return <ErrorAlert id={id}>{msg}</ErrorAlert>;
  }

  // TODO: when should this error be shown?
  const errorElement =
    q.data.period === PoxOperationPeriod.Period1 ? (
      <ErrorPeriod1 />
    ) : (
      <ErrorPostPeriod1 />
    );

  const errorEl = meta.touched && meta.error;

  return (
    <Step title="Bitcoin address">
      <Stack>
        <Text>Choose the address where you’d like to receive bitcoin.</Text>
        <AddressField
          name="poxAddress"
          placeholder="Bitcoin address"
          error={errorEl}
        />
      </Stack>
    </Step>
  );
}
