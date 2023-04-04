import { useNavigate } from 'react-router-dom';

import { StackerInfo } from '@stacks/stacking';
import { Box, Button, Flex, Text } from '@stacks/ui';
import { IconLock } from '@tabler/icons-react';
import { useField, useFormikContext } from 'formik';

import { Address } from '@components/address';
import { BaseDrawer } from '@components/drawer/base-drawer';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { Hr } from '@components/hr';
import {
  InfoCardGroup as Group,
  InfoCard,
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardSection as Section,
  InfoCardValue as Value,
} from '@components/info-card';
import { MAX_STACKING_CYCLES, MIN_STACKING_CYCLES } from '@constants/app';
import routes from '@constants/routes';
import { hasErrors } from '@utils/form/has-errors';
import { formatPoxAddressToNetwork } from '@utils/stacking';

import { OneCycleDescriptor } from '../../components/one-cycle-descriptor';
import { PendingStackExtendAlert } from '../../components/pending-stack-extend-alert';
import { Description } from '../../components/stacking-form-step';
import { Stepper } from '../../components/stepper';
import { StackExtendInfo } from '../../direct-stacking-info/get-has-pending-stack-extend';
import { EditingFormValues } from '../utils';

interface StackExtendLayoutProps {
  title: string;
  details: (StackerInfo & { stacked: true })['details'];
  pendingStackExtend: StackExtendInfo | undefined | null;
  isContractCallExtensionPageOpen: boolean;
}
export function StackExtendLayout(props: StackExtendLayoutProps) {
  const { title, details, pendingStackExtend, isContractCallExtensionPageOpen } = props;
  const navigate = useNavigate();
  const poxAddress = formatPoxAddressToNetwork(details.pox_address);
  const { errors } = useFormikContext<EditingFormValues>();
  const [field, meta, helpers] = useField('extendCycles');
  const onClose = () => {
    navigate(routes.DIRECT_STACKING_INFO);
  };
  console.log({ meta });
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
                for {details.lock_period} cycles
              </Text>
            </Flex>
            <Hr />
            {pendingStackExtend && (
              <PendingStackExtendAlert pendingStackExtend={pendingStackExtend} />
            )}
            <Description>
              <Text>
                Increase the amount of cycles you want to lock your STX. Currently each cycle lasts
                around 15 days and the maximum locked period is 12 cycles.
              </Text>
            </Description>

            <Flex justifyContent="center">
              <Stepper
                mt="loose"
                amount={field.value}
                onIncrement={cycle => {
                  if (cycle > MAX_STACKING_CYCLES) return;
                  helpers.setTouched(true);
                  helpers.setValue(cycle);
                }}
                onDecrement={cycle => {
                  if (cycle < MIN_STACKING_CYCLES) return;
                  helpers.setTouched(true);
                  helpers.setValue(cycle);
                }}
              />
            </Flex>
            {meta.touched && meta.error && (
              <ErrorLabel>
                <ErrorText>{meta.error}</ErrorText>
              </ErrorLabel>
            )}
            <OneCycleDescriptor mt="loose" />
            <Group pt="base-loose">
              <Section>
                <Row>
                  <Label explainer="STX will unlock after that cycle">End</Label>
                  <Value>Cycle {details.first_reward_cycle + details.lock_period - 1} </Value>
                </Row>
                <Row>
                  <Label>Bitcoin address</Label>
                  <Value>
                    <Address address={poxAddress} />
                  </Value>
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
                    Continue Stacking
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
