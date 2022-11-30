import { useConnect } from "@stacks/connect-react";
import { Box, Button, color, Flex, Text } from "@stacks/ui";
import { SignInLayout } from "./sign-in.layout";

interface SignInProps {}
export function SignIn(props: SignInProps) {
  const { doAuth } = useConnect();
  return (
    <SignInLayout>
      <Text
        as="h1"
        color={color("text-title")}
        fontSize="28px"
        mb="extra-loose"
      >
        Get stacking
      </Text>
      <Button alignSelf="center" onClick={() => doAuth()}>
        Connect your wallet
      </Button>
    </SignInLayout>
  );
}
