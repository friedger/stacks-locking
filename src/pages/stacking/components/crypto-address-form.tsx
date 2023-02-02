import { forwardRef } from "react";
import { Input, InputProps } from "@stacks/ui";
import { useField } from "formik";

interface CryptoAddressInputProps extends Omit<InputProps, "form"> {
  fieldName: string;
}

export const CryptoAddressInput = forwardRef<
  HTMLInputElement,
  CryptoAddressInputProps
>((props, ref) => {
  const { fieldName, children, ...rest } = props;
  const [field] = useField(fieldName);
  return (
    <>
      <Input
        id={fieldName}
        name={fieldName}
        mt="loose"
        maxWidth="400px"
        fontFamily={field.value.length ? "monospace" : "unset"}
        ref={ref}
        {...rest}
      />
      {children}
    </>
  );
});
CryptoAddressInput.displayName = "CryptoAddressInput";
