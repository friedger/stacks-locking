import { useState } from "react";

import { Action, Step } from "../../components/stacking-form-step";
import { StackingUserConfirm } from "../../components/stacking-user-confirm";
import { DelegatedStackingTerms } from "./delegated-stacking-terms";

interface Props {
  isLoading: boolean;
}
export function ConfirmAndSubmit({ isLoading }: Props) {
  const [hasUserConfirmed, setHasUserConfirmed] = useState(false);

  return (
    <Step title="Confirm and pool">
      <DelegatedStackingTerms mt="loose" />
      <StackingUserConfirm
        onChange={(useConfirmed) => setHasUserConfirmed(useConfirmed)}
      />
      <Action
        type="submit"
        isLoading={isLoading}
        isDisabled={!hasUserConfirmed}
      >
        Confirm and start pooling
      </Action>
    </Step>
  );
}
