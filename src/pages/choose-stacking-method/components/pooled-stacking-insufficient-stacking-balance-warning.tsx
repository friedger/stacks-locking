import { ChooseStackingMethodLayoutProps } from '../types';
import { InsufficientStackingBalanceWarning } from './start-stacking-layout';

export function PooledStackingInsufficientStackingBalanceWarning(
  props: ChooseStackingMethodLayoutProps
) {
  if (!props.isSignedIn) return null;

  return <>{!props.hasEnoughBalanceToPool && <InsufficientStackingBalanceWarning />}</>;
}
