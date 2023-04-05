import { useAuth } from '@components/auth-provider/auth-provider';
import { useNavigate } from '@hooks/use-navigate';

import { StackingOptionCardButton as OptionButton } from '../components/start-stacking-layout';
import { ChooseStackingMethodLayoutProps } from '../types';
import { hasExistingCommitment } from '../utils';

export function PooledStackingButton(props: ChooseStackingMethodLayoutProps) {
  const navigate = useNavigate();
  const { signIn, isSigningIn } = useAuth();

  const isDisabled = props.isSignedIn
    ? hasExistingCommitment(props) || !props.hasEnoughBalanceToPool
    : isSigningIn;

  return (
    <OptionButton
      onClick={() => {
        if (!props.isSignedIn) {
          signIn();
          return;
        }

        navigate('../start-pooled-stacking');
      }}
      isDisabled={isDisabled}
    >
      Stack in a pool
    </OptionButton>
  );
}
