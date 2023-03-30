import { Action, Step } from '../../../components/stacking-form-step';

interface ConfirmAndSubmitProps {
  isLoading: boolean;
}

export function ConfirmAndSubmit({ isLoading }: ConfirmAndSubmitProps) {
  return (
    <Step title="Stack aggregation commit">
      <Action type="submit" isLoading={isLoading}>
        Finalize the cycle
      </Action>
    </Step>
  );
}
