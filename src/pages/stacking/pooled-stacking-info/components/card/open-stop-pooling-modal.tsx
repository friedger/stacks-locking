import { Box, Alert, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons';
import { openConfirmModal, closeModal } from '@mantine/modals';

export const modalId = 'stop-pooling';

interface Args {
  isStacking: boolean;
  handleStopPoolingClick(): void;
}

export function openStopPoolingModal({ isStacking, handleStopPoolingClick }: Args) {
  openConfirmModal({
    modalId,
    closeOnConfirm: false,
    title: 'Stop pooling',
    children: (
      <>
        <Text>Are you sure you want to stop pooling?</Text>
        {isStacking && (
          <Box>
            <Alert icon={<IconInfoCircle size="16" />}>
              Your STX are currently active in a cycle, they will not be unlocked until the end of
              the full locking period.
            </Alert>
          </Box>
        )}
      </>
    ),
    labels: { cancel: 'Cancel', confirm: 'Stop pooling' },
    onConfirm() {
      handleStopPoolingClick();
    },
  });
}
