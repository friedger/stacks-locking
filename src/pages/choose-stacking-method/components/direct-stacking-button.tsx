import { useNavigate } from 'react-router-dom';
import { ChooseStackingMethodLayoutProps } from '../types';
import { hasExistingCommitment } from '../utils';
import { StackingOptionCardButton as OptionButton } from '../components/start-stacking-layout';
import { useAuth } from '@components/auth-provider/auth-provider';

export function DirectStackingButton(props: ChooseStackingMethodLayoutProps) {
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

        navigate('../start-direct-stacking');
      }}
      isDisabled={isDisabled}
    >
      Stack by yourself
    </OptionButton>
  );
}
