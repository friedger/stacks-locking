import { Navigate } from 'react-router-dom';

import { useAuth } from '@components/auth-provider/auth-provider';

import { Button, Card, Center, Container, Stack, Text, Title } from '@mantine/core';

export function SignIn() {
  const { isSignedIn, signIn, isSigningIn } = useAuth();
  if (isSignedIn) {
    return <Navigate to="../choose-stacking-method" />;
  }

  return (
    <Center w="100vw" h="100vh">
      <Card w="350px" h="200px" withBorder>
        <Center h="100%">
          <Stack>
            <Title>Get stacking</Title>
            <Button onClick={signIn} loading={isSigningIn}>
              Connect your wallet
            </Button>
          </Stack>
        </Center>
      </Card>
    </Center>
  );
}
