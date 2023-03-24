import { ChooseStackingMethodLayoutProps } from '../types';
import { InsufficientStackingBalanceWarning } from './start-stacking-layout';

export function DirectStackingInsufficientStackingBalanceWarning(
  props: ChooseStackingMethodLayoutProps
) {
  if (!props.isSignedIn) return null;

  return <>{!props.hasEnoughBalanceToDirectStack && <InsufficientStackingBalanceWarning />}</>;
}
