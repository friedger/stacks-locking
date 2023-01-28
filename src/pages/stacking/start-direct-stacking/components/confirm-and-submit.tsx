import { useState } from "react";

import { Stack } from "@mantine/core";

import { Action, Step } from "../../components/stacking-form-step";
import { StackingUserConfirm } from "../../components/stacking-user-confirm";
import { DirectStackingTerms } from "./direct-stacking-terms";

interface ConfirmAndSubmitProps {
  isLoading: boolean;
}

export function ConfirmAndSubmit({ isLoading }: ConfirmAndSubmitProps) {
  const [hasUserConfirmed, setHasUserConfirmed] = useState(false);

  return (
    <Step title="Confirm and stack">
      <Stack>
        <DirectStackingTerms />
        <StackingUserConfirm
          onChange={(useConfirmed) => setHasUserConfirmed(useConfirmed)}
        />
        <Action type="submit" loading={isLoading} disabled={!hasUserConfirmed}>
          Confirm and start stacking
        </Action>
      </Stack>
    </Step>
  );
}
