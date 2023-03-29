import { Link } from 'react-router-dom';

import { Alert } from '@components/alert';
import { InfoCard } from '@components/info-card';
import { Caption } from '@components/typography';
import { color, Flex, Stack, Text } from '@stacks/ui';
import { IconInfoCircle } from '@tabler/icons-react';

export function NoStacking() {
  return (
    <Flex height="100%" justify="center" align="center" m="loose">
      <InfoCard width="420px">
        <Alert icon={<IconInfoCircle />}>
          <Stack>
            <Text>
              It appears that you&apos;re not stacking yet. If you recently started to stack, your
              stacking info will appear here in a few seconds.
            </Text>
            <Text>
              You may want to{' '}
              <Caption
                display="inline"
                to="../start-direct-stacking"
                color={color('brand')}
                as={Link}
              >
                start stacking
              </Caption>{' '}
              or{' '}
              <Caption
                display="inline"
                color={color('brand')}
                to="../choose-stacking-method"
                as={Link}
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
