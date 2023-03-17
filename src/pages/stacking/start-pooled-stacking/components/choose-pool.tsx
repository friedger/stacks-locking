import { ChoosePoolFromPreset } from "./choose-pool-from-preset";
import { ChoosePoolAddress } from "./choose-pool-stx-address";

export function ChoosePool() {
  return (
    <>
      <ChoosePoolFromPreset />
      <ChoosePoolAddress />
    </>
  );
}
