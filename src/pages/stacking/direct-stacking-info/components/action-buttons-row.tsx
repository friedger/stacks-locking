import { useNavigate } from 'react-router-dom';

import { Button } from '@stacks/ui';

import { InfoCardRow as Row } from '@components/info-card';

export function ActionButtonsRow() {
  const navigate = useNavigate();
  async function handleLockMoreClick() {
    navigate('../lock-more-stx');
  }

  async function handleExtendStackingClick() {
    navigate('../extend-stacking');
  }
  return (
    <Row mt="loose" justifyContent="space-evenly">
      <Button mode="tertiary" onClick={handleLockMoreClick}>
        Lock more STX
      </Button>
      <Button mode="tertiary" onClick={handleExtendStackingClick}>
        Extend stacking
      </Button>
    </Row>
  );
}
