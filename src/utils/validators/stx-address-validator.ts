import { StacksNetworkName } from "@stacks/network";
import { validateStacksAddress } from "@stacks/transactions";
import * as yup from "yup";

import { NETWORK } from "@constants/app";
import { validateAddressChain } from "@crypto/validate-address-net";

export function stxAddressSchema(networkName: StacksNetworkName) {
  return yup
    .string()
    .defined("Must define a STX address")
    .test({
      name: "address-validation",
      test(value, context) {
        if (!value) return false;
        const valid = validateStacksAddress(value);

        if (!valid) {
          return context.createError({
            message: "Input address is not a valid STX address",
          });
        }
        if (!validateAddressChain(value, networkName)) {
          return context.createError({
            message: `Must use a ${networkName} STX address`,
          });
        }
        return true;
      },
    });
}
