import { Action, Step } from './stacking-form-step';

interface ConfirmAndSubmitProps {
  isLoading: boolean;
  title: string;
  actionLabel: string;
}

export function ConfirmAndSubmit({ isLoading, title, actionLabel }: ConfirmAndSubmitProps) {
  return (
    <Step title={title}>
      <Action type="submit" isLoading={isLoading}>
        {actionLabel}
      </Action>
    </Step>
  );
}
