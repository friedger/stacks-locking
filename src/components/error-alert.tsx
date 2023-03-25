import { ReactNode } from 'react';

import { Box, color } from '@stacks/ui';
import { IconAlertCircle } from '@tabler/icons-react';

interface Props {
  id?: string;
  children?: ReactNode;
}
export function ErrorAlert({ id, children }: Props) {
  return (
    <Box
      bg={color('feedback-error')}
      icon={<IconAlertCircle size={16} />}
      title={`Error ${id ? id : ''}`}
      color={color('text-body')}
    >
      {children}
    </Box>
  );
}
