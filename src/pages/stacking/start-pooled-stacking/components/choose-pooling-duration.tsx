import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { Box, color, Flex, Stack, Text } from '@stacks/ui';
import { useField } from 'formik';
import { Description, Step } from '../../components/stacking-form-step';
import { DurationCyclesField } from './duration-cycles-field';
import { DurationSelectItem } from './duration-select-item';
import { IndefiniteStackingIcon } from './indefinite-stacking-icon';
import { LimitedStackingIcon } from './limited-stacking-icon';

function RecommendedFor({ children }: { children?: React.ReactNode }) {
  return (
    <Box background={color('bg-alt')} my="loose" py="loose" px="base-loose" borderRadius="10px">
      <Flex>
        <Box>
          <Text
            fontSize="14px"
            lineHeight="20px"
            display="block"
            fontWeight={500}
            fontFamily="Open Sauce"
            letterSpacing="-0.02em"
            color={color('text-title')}
            mb="base"
          >
            Recommended for
          </Text>
          <Text>{children} </Text>
        </Box>
      </Flex>
    </Box>
  );
}

export function ChoosePoolingDuration() {
  const [fieldNumberOfCycles] = useField('numberOfCycles');
  const [fieldDelegationDurationType, metaDelegationDurationType, helpersDelegationDurationType] =
    useField('delegationDurationType');

  return (
    <Step title="Duration">
      <Description>
        <Text>
          Choose whether you want to pool with a limited duration, or give the pool indefinite
          permission. Each cycles lasts around 15 days.
        </Text>
      </Description>

      <Stack spacing="base" mt="extra-loose">
        <DurationSelectItem
          title="Indefinite permission"
          icon={<IndefiniteStackingIcon />}
          delegationType="indefinite"
          activeDelegationType={fieldDelegationDurationType.value}
          onChange={val => helpersDelegationDurationType.setValue(val)}
        >
          <Text>
            Allow the pool to stack on your behalf for a max of 12 cycles at a time. You can unlock
            them at any moment by revoking the pool permission but keep in mind that your STX will
            be locked until completing the duration initially set by the pool.
          </Text>
          <RecommendedFor>
            Users who wish to stack continuously and, when wishing to access STX again, understand
            revocation must be done before funds are re-stacked by pool.
          </RecommendedFor>
        </DurationSelectItem>
        <DurationSelectItem
          title="Limited permission"
          delegationType="limited"
          icon={<LimitedStackingIcon cycles={fieldNumberOfCycles.value || 1} />}
          activeDelegationType={fieldDelegationDurationType.value}
          onChange={val => helpersDelegationDurationType.setValue(val)}
        >
          <Text>
            Set a limit between 1 and 12 cycles for how long the pool can stack on your behalf. Make
            sure you don&apos;t set it lower than the number of cycles your pool intends to stack.
          </Text>
          {fieldDelegationDurationType.value === 'limited' && <DurationCyclesField />}
          <RecommendedFor>
            Users who want to guarantee funds are not locked beyond a certain period.
          </RecommendedFor>
        </DurationSelectItem>
      </Stack>

      {metaDelegationDurationType.touched && metaDelegationDurationType.error && (
        <ErrorLabel mt="base-loose">
          <ErrorText>{metaDelegationDurationType.error}</ErrorText>
        </ErrorLabel>
      )}
    </Step>
  );
}
