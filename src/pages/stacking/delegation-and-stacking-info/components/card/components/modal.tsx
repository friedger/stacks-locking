import {
  modalStyle,
  StackingModalHeader,
  StackingModalFooter,
} from '@components/modals/components/stacking-modal-layout';
import { Modal, Text, Box, ButtonGroup, Button } from '@stacks/ui';

interface Props {
  isStacking: boolean;
  isOpen: boolean;
  onClose(): void;
  onStopPoolingClick(): void;
}

export function RevokeDelegationModal({ isStacking, isOpen, onClose, onStopPoolingClick }: Props) {
  return (
    <Modal title="Stop pooling" isOpen={isOpen} {...modalStyle}>
      <StackingModalHeader onSelectClose={onClose}>Stop pooling</StackingModalHeader>
      <Box padding="base">
        <Text>Are you sure you want to stop pooling?</Text>
      </Box>
      {isStacking && (
        <Box padding="base">
          <Text>
            Your STX are currently active in a cycle, they will not be unlocked until the end of the
            full locking period.
          </Text>
        </Box>
      )}
      <StackingModalFooter>
        <ButtonGroup>
          <Button mode="tertiary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onStopPoolingClick}>Stop pooling</Button>
        </ButtonGroup>
      </StackingModalFooter>
    </Modal>
  );
}
