import { Flex, Stack, Text, color } from '@stacks/ui';
import { IconInfoCircle } from '@tabler/icons-react';

import { Alert } from '@components/alert';
import { InfoCard } from '@components/info-card';
import { Link } from '@components/link';
import { Caption } from '@components/typography';

export function NoPooling() {
  return (
    <Flex height="100%" justify="center" align="center" m="loose">
      <InfoCard p="extra-loose" width={['360px', '360px', '360px', '420px']}>
        <Alert icon={<IconInfoCircle />}>
          <Stack>
            <Text>
              It appears that you&apos;re not pooling yet. If you recently started to pool, your
              pooling info will appear here in a few seconds.
            </Text>
            <Text>
              You may want to{' '}
              <Caption
                display="inline"
                to="../start-pooled-stacking"
                as={Link}
                color={color('brand')}
              >
                start pooling
              </Caption>{' '}
              or{' '}
              <Caption
                display="inline"
                to="../choose-stacking-method"
                as={Link}
                color={color('brand')}
              >
                choose your stacking method
              </Caption>
              .
            </Text>
          </Stack>
        </Alert>
      </InfoCard>
    </Flex>
  );
}
