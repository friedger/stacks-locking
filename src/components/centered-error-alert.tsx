import { ReactNode } from 'react';

import { Box, Flex, color } from '@stacks/ui';

import { ErrorAlert } from './error-alert';
import { InfoCard } from './info-card';

interface Props {
  id?: string;
  children?: ReactNode;
}

export function CenteredErrorAlert({ id, children }: Props) {
  return (
    <InfoCard m="extra-loose" justify="center" align="center" bg={color('feedback-error')}>
      <ErrorAlert id={id}>{children}</ErrorAlert>
    </InfoCard>
  );
}
