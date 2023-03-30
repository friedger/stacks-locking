import { Action, Step } from '../../../components/stacking-form-step';

interface ConfirmAndSubmitProps {
  isLoading: boolean;
}

export function ConfirmAndSubmit({ isLoading }: ConfirmAndSubmitProps) {
  return (
    <Step title="Confirm and lock">
      <Action type="submit" isLoading={isLoading}>
        Confirm and lock STX
      </Action>
    </Step>
  );
}
