import { PoxOperationPeriod } from "@stacks/stacking/dist/constants";
import { useField } from "formik";

import { ErrorAlert } from "@components/error-alert";
import { useGetPoxOperationInfo } from "@components/stacking-client-provider/stacking-client-provider";

import { Description, Step } from "../../../components/stacking-form-step";
import { ErrorPeriod1, ErrorPostPeriod1 } from "./components/errors";
import { Spinner, Text } from "@stacks/ui";
import { CryptoAddressInput } from "src/pages/stacking/components/crypto-address-form";
import { ErrorLabel } from "@components/error-label";
import { ErrorText } from "@components/error-text";

export function PoxAddress() {
  const [field, meta] = useField("poxAddress");
  const q = useGetPoxOperationInfo();

  if (q.isLoading) return <Spinner />;
  if (q.isError || !q.data) {
    const id = "e69b0abe-495d-4587-9693-8bd4541dddaf";
    const msg = "Failed to establish current PoX period.";
    console.error(id, msg);
    return <ErrorAlert id={id}>{msg}</ErrorAlert>;
  }

  // TODO: when should this error be shown?
  const addressError =
    q.data.period === PoxOperationPeriod.Period1 ? (
      <ErrorPeriod1 />
    ) : (
      <ErrorPostPeriod1 />
    );

  const errors = meta.error ? (
    <ErrorLabel maxWidth="430px">
      <ErrorText lineHeight="18px">
        {meta.error === "is-bech32" ? addressError : meta.error}
      </ErrorText>
    </ErrorLabel>
  ) : null;

  return (
    <>
      <Step title="Bitcoin address">
        <Description>
          <Text>
            Enter the Bitcoin address where you&apos;d like to receive your
            rewards.
          </Text>
        </Description>
        <CryptoAddressInput
          fieldName="poxAddress"
          placeholder="Bitcoin address (Legacy, Native SegWit or Taproot)"
          {...field}
        >
          {meta.touched && errors}
        </CryptoAddressInput>
      </Step>
    </>
  );
}
