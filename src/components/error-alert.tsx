import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { ReactNode } from 'react';

interface Props {
  id?: string;
  children?: ReactNode;
}
export function ErrorAlert({ id, children }: Props) {
  return (
    <Alert icon={<IconAlertCircle size={16} />} title={`Error ${id ? id : ''}`} color="red">
      {children}
    </Alert>
  );
}
