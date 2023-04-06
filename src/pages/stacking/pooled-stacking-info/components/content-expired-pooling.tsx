import { Box, Button, Text } from '@stacks/ui';

interface ExpiredPoolingContentProps {
  isContractCallExtensionPageOpen: boolean;
  handleStopPoolingClick: () => void;
}
export function ExpiredPoolingContent({
  isContractCallExtensionPageOpen,
  handleStopPoolingClick,
}: ExpiredPoolingContentProps) {
  return (
    <>
      <Text textStyle="display.large">You&apos;ve finished pooling</Text>
      <Text pb="base-loose">
        Revoke the pool&apos;s permission to stack on your behalf to start stacking again.
      </Text>
      <Box>
        <Button
          disabled={isContractCallExtensionPageOpen}
          onClick={() => {
            handleStopPoolingClick();
          }}
        >
          Revoke permission
        </Button>
      </Box>
    </>
  );
}
