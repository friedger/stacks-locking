import BigNumber from "bignumber.js";
import * as yup from "yup";

import { stxToMicroStx } from "@utils/unit-convert";

export function stxBalanceValidator(balance: bigint): yup.TestConfig<string> {
  return {
    name: "test-balance",
    message: "Amount must be lower than balance",
    test: (value) => {
      if (typeof value !== "string") return false;
      const enteredAmount = stxToMicroStx(value);
      return enteredAmount.isLessThanOrEqualTo(
        new BigNumber(balance.toString())
      );
    },
  };
}
