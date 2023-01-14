import { useField } from 'formik';

import { Text, Stack } from '@mantine/core';

import { Step, Description } from '../../components/stacking-form-step';
import { DurationSelectItem } from './duration-select-item';
import { DurationCyclesField } from './duration-cycles-form';
import { LimitedStackingIcon } from './limited-stacking-icon';
import { IndefiniteStackingIcon } from './indefinite-stacking-icon';
import { OneCycleDescriptor } from '../../components/one-cycle-descriptor';

export function ChoosePoolingDuration() {
  const [fieldNumberOfCycles] = useField('numberOfCycles');
  const [fieldDelegationDurationType, metaDelegationDurationType, helpersDelegationDurationType] =
    useField('delegationDurationType');

  return (
    <Step title="Duration">
      <Stack>
        <Description>
          <Text>
            Choose whether you want to pool with a limited duration, or give the pool indefinite
            permission. If you set a limit, make sure you don’t set it lower than the number of
            cycles your pool intends to stack.
          </Text>
        </Description>

        <DurationSelectItem
          title="Limited"
          delegationType="limited"
          icon={<LimitedStackingIcon cycles={fieldNumberOfCycles.value || 1} />}
          activeDelegationType={fieldDelegationDurationType.value}
          onChange={val => helpersDelegationDurationType.setValue(val)}
        >
          Set a limit between 1 and 12 cycles for how long the pool can stack on your behalf. The
          pool will only be able to stack your STX up to that limit.
          {fieldDelegationDurationType.value === 'limited' && <DurationCyclesField />}
        </DurationSelectItem>
        <DurationSelectItem
          title="Indefinite"
          icon={<IndefiniteStackingIcon />}
          delegationType="indefinite"
          activeDelegationType={fieldDelegationDurationType.value}
          onChange={val => helpersDelegationDurationType.setValue(val)}
        >
          The pool has indefinite permission to lock your STX for up to 12 cycles at a time. Revoke
          manually at any time to prevent further locks.
        </DurationSelectItem>
        <OneCycleDescriptor mt="loose" />
        {metaDelegationDurationType.touched && metaDelegationDurationType.error && (
          <Text c="red" fz="xs" mt="-12px">
            {metaDelegationDurationType.error}
          </Text>
        )}
      </Stack>
    </Step>
  );
}
