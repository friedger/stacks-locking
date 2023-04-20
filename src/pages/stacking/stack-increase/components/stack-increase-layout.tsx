import { useNavigate } from 'react-router-dom';

import { AccountExtendedBalances } from '@stacks/stacking';
import { Box, Button, Flex, Text } from '@stacks/ui';

import { BaseDrawer } from '@components/drawer/base-drawer';
import { Hr } from '@components/hr';
import {
  InfoCardGroup as Group,
  InfoCard,
  InfoCardRow as Row,
  InfoCardSection as Section,
} from '@components/info-card';
import routes from '@constants/routes';
import { toHumanReadableStx } from '@utils/unit-convert';

interface StackIncreaseLayoutProps {
  title: string;
  extendedStxBalances: AccountExtendedBalances['stx'];
}
export function StackIncreaseLayout(props: StackIncreaseLayoutProps) {
  const { title, extendedStxBalances } = props;
  const navigate = useNavigate();
  const onClose = () => {
    navigate(routes.DIRECT_STACKING_INFO);
  };
  return (
    <BaseDrawer title={title} isShowing onClose={onClose}>
      <Flex alignItems="center" flexDirection="column" pb={['loose', '48px']} px="loose">
        <InfoCard width="420px">
          <Box mx={['loose', 'extra-loose']}>
            <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
              <Text textStyle="body.large.medium">You&apos;re stacking</Text>
              <Text
                fontSize="24px"
                fontFamily="Open Sauce"
                fontWeight={500}
                letterSpacing="-0.02em"
                mt="extra-tight"
              >
                {toHumanReadableStx(extendedStxBalances.locked.toString())}
              </Text>
            </Flex>
            <Hr />

            <Text>
              Increasing stacking amount for direct stackers was disabled in preparation of Stacks
              2.2.
            </Text>
            <Text>
              To increase the stacking amount, you can use pooled stacking with a pool address that you control.
            </Text>
            <Group pt="base-loose">
              <Section>
                <Row m="loose" justifyContent="space-between">
                  <Button mode="tertiary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button mode="tertiary" onClick={() => navigate(routes.START_POOLED_STACKING)}>
                    Choose pooled stacking
                  </Button>
                </Row>
              </Section>
            </Group>
          </Box>
        </InfoCard>
      </Flex>
    </BaseDrawer>
  );
}
