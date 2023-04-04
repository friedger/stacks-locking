import { useNavigate } from 'react-router-dom';

import { AccountExtendedBalances, StackerInfo } from '@stacks/stacking';
import { Box, Button, Flex, Text } from '@stacks/ui';
import { IconClockHour4, IconLock } from '@tabler/icons-react';
import { useFormikContext } from 'formik';

import { Alert, AlertText } from '@components/alert';
import { BaseDrawer } from '@components/drawer/base-drawer';
import { Hr } from '@components/hr';
import {
  InfoCardGroup as Group,
  InfoCard,
  InfoCardRow as Row,
  InfoCardSection as Section,
} from '@components/info-card';
import routes from '@constants/routes';
import { hasErrors } from '@utils/form/has-errors';
import { toHumanReadableStx } from '@utils/unit-convert';

import { PendingStackIncreaseAlert } from '../../components/pending-stack-increase-alert';
import { StackIncreaseInfo } from '../../direct-stacking-info/get-has-pending-stack-increase';
import { EditingFormValues } from '../utils';
import { Amount } from './choose-amount';

interface StackIncreaseLayoutProps {
  title: string;
  extendedStxBalances: AccountExtendedBalances['stx'];
  pendingStackIncrease: StackIncreaseInfo | undefined | null;
  isContractCallExtensionPageOpen: boolean;
}
export function StackIncreaseLayout(props: StackIncreaseLayoutProps) {
  const { title, extendedStxBalances, pendingStackIncrease, isContractCallExtensionPageOpen } =
    props;
  const navigate = useNavigate();
  const { errors } = useFormikContext<EditingFormValues>();
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

            {pendingStackIncrease && (
              <PendingStackIncreaseAlert pendingStackIncrease={pendingStackIncrease} />
            )}

            <Group pt="base-loose">
              <Section>
                <Row>
                  <Amount />
                </Row>

                <Row m="loose" justifyContent="space-between">
                  <Button mode="tertiary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    isLoading={isContractCallExtensionPageOpen}
                    isDisabled={hasErrors(errors)}
                  >
                    <Box mr="loose">
                      <IconLock />
                    </Box>
                    Confirm Increase
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
