import { Alert } from '@components/alert';
import { ExternalLink } from '@components/external-link';
import { Caption } from '@components/typography';
import { BUY_STACKS_URL } from '@constants/app';
import { Stack, color, Text } from '@stacks/ui';
import { IconInfoCircle } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { SignedInProps } from '../types';
import { hasExistingCommitment } from '../utils';

export function Messages({
  hasEnoughBalanceToDirectStack,
  hasEnoughBalanceToPool,
  hasExistingDelegatedStacking,
  hasExistingDelegation,
  hasExistingDirectStacking,
}: SignedInProps) {
  return (
    <Stack spacing="base-tight">
      {(hasExistingDelegation || hasExistingDelegatedStacking) && (
        <Alert icon={<IconInfoCircle />}>
          <Stack>
            <Text>
              It appears that you&apos;re currently pooling. If you recently revoked your delegation
              after the pool unlocked your funds, you&apos;ll soon be able to pool again. This
              usually takes a few seconds.
            </Text>
            <Text>
              <Caption color={color('brand')} to="../pooled-stacking-info" as={Link}>
                View your pooling info.
              </Caption>
            </Text>
          </Stack>
        </Alert>
      )}
      {hasExistingDirectStacking && (
        <Alert icon={<IconInfoCircle />}>
          <Stack>
            <Text>
              It appears that you&apos;re currently stacking. If your locking period recently ended,
              you&apos;ll soon be able to stack again.
            </Text>
            <Caption color={color('brand')} to="../direct-stacking-info" as={Link}>
              View your stacking info.
            </Caption>
          </Stack>
        </Alert>
      )}
      {!hasExistingCommitment && !hasEnoughBalanceToPool && !hasEnoughBalanceToDirectStack && (
        <Alert icon={<IconInfoCircle />}>
          <Stack>
            <Text>
              It appears that you don&apos;t have enough funds yet. If you recently transferred
              funds to this account, you&apos;ll soon be able to stack.{' '}
            </Text>
            <ExternalLink href={BUY_STACKS_URL}>Consider topping up your account</ExternalLink>
          </Stack>
        </Alert>
      )}
    </Stack>
  );
}
