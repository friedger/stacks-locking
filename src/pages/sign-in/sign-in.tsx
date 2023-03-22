import { Navigate } from 'react-router-dom';

import { useAuth } from '@components/auth-provider/auth-provider';
import { Card } from '@components/card';
import { Title } from '@components/title';
import { Button, Flex, Stack } from '@stacks/ui';
import { ChooseStackingMethodLayout } from '../choose-stacking-method/choose-stacking-method';

export function SignIn() {
  const { isSignedIn, signIn, isSigningIn } = useAuth();
  if (isSignedIn) {
    return <Navigate to="../choose-stacking-method" />;
  }

  return (
    <Flex flexDirection="column" justify="center" alignItems="center" mx="auto" px="extra-loose">
      <Card width="300px" mt="44px">
        <Stack>
          <Title pb="1rem">Get stacking</Title>
          <Button onClick={signIn} isLoading={isSigningIn}>
            Connect your wallet
          </Button>
        </Stack>
      </Card>
      <ChooseStackingMethodLayout
        hasEnoughBalanceToDirectStack
        hasEnoughBalanceToPool
        hasExistingDelegation={false}
        hasExistingDelegatedStacking={false}
        hasExistingDirectStacking={false}
        stackingMinimumAmountUstx={100000000000n}
        withoutAccount
      />
    </Flex>
  );
}
