import { useNavigate } from 'react-router-dom';
import { ChooseStackingMethodLayoutProps } from '../types';
import { hasExistingCommitment } from '../utils';
import { StackingOptionCardButton as OptionButton } from '../components/start-stacking-layout';
import { useAuth } from '@components/auth-provider/auth-provider';

export function DirectStackingButton(props: ChooseStackingMethodLayoutProps) {
  const navigate = useNavigate();
  const { signIn, isSigningIn } = useAuth();

  if (!props.isSignedIn) {
    return (
      <OptionButton
        onClick={() => {
          signIn();
        }}
        isDisabled={isSigningIn}
      >
        Connect wallet
      </OptionButton>
    );
  }

  return (
    <OptionButton
      onClick={() => navigate('../start-direct-stacking')}
      isDisabled={hasExistingCommitment(props) || !props.hasEnoughBalanceToDirectStack}
    >
      Stack by yourself
    </OptionButton>
  );
}
