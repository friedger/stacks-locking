import { Navigate } from "react-router-dom";

import { useAuth } from "@components/auth-provider/auth-provider";
import { Button, Flex, Stack } from "@stacks/ui";
import { Card } from "@components/card";
import { Title } from "@components/title";

export function SignIn() {
  const { isSignedIn, signIn, isSigningIn } = useAuth();
  if (isSignedIn) {
    return <Navigate to="../choose-stacking-method" />;
  }

  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">
      <Card width="300px">
        <Stack>
          <Title pb="1rem">Get stacking</Title>
          <Button onClick={signIn} isLoading={isSigningIn}>
            Connect your wallet
          </Button>
        </Stack>
      </Card>
    </Flex>
  );
}
