import { ErrorLabel } from "@components/error-label";
import { ErrorText } from "@components/error-text";
import { Text } from "@stacks/ui";
import { useField } from "formik";
import { CryptoAddressInput } from "../../components/crypto-address-form";

export function CustomPoolAddressInput() {
  const [field, meta] = useField("poolAddress");
  return (
    <>
      <Text>
        The pool will provide this address for you. Pools can have different
        addresses that correspond to particular durations.
      </Text>
      <CryptoAddressInput
        fieldName="poolAddress"
        placeholder="Pool address"
        {...field}
      >
        {meta.touched && meta.error && (
          <ErrorLabel>
            <ErrorText>{meta.error}</ErrorText>
          </ErrorLabel>
        )}
      </CryptoAddressInput>
    </>
  );
}
