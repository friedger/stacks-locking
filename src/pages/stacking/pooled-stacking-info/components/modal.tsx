import { Alert, Box, Button, Group, Modal, Stack, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

interface Props {
  isStacking: boolean;
  isOpen: boolean;
  onClose(): void;
  onStopPoolingClick(): void;
  isContractCallExtensionPageOpen: boolean;
}

export function RevokeDelegationModal({
  isContractCallExtensionPageOpen,
  isStacking,
  isOpen,
  onClose,
  onStopPoolingClick,
}: Props) {
  return (
    <Modal title="Stop pooling" opened={isOpen} onClose={onClose}>
      <Box mb="16px">
        <Stack>
          <Text>Are you sure you want to stop pooling?</Text>
          {isStacking && (
            <Alert icon={<IconInfoCircle size="16" />}>
              Your STX are currently active in a cycle, they will not be unlocked until the end of
              the full locking period.
            </Alert>
          )}
        </Stack>
      </Box>

      <Group position="right">
        <Button variant="default" onClick={onClose}>
          Close
        </Button>
        <Button loading={isContractCallExtensionPageOpen} onClick={onStopPoolingClick}>
          Stop pooling
        </Button>
      </Group>
    </Modal>
  );
}
