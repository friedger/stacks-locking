import { Flex, Stack } from '@mantine/core';

interface SignInLayoutProps {
  children: React.ReactNode;
}
export function SignInLayout({ children }: SignInLayoutProps) {
  return (
    <Stack>
      <Flex
        flexDirection="column"
        background={color('bg-3')}
        width="580px"
        height="400px"
        px="58px"
        py="48px"
        border="1px solid"
        justifyContent="center"
        borderColor={color('border')}
        borderRadius="24px"
      >
        {children}
      </Flex>
    </Stack>
  );
}
