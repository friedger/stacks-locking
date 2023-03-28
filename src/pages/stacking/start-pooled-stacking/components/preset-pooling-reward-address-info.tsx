import { Text } from '@stacks/ui';
import { useFormikContext } from 'formik';
import { Description, Step } from '../../components/stacking-form-step';
import { EditingFormValues } from '../types';
import { PayoutMethod } from '../types-preset-pools';
import { pools } from './preset-pools';

export function PresetPoolingRewardAddressInfo() {
  const f = useFormikContext<EditingFormValues>();

  const { poolName } = f.values;
  const payoutMethod = poolName ? pools[poolName].payoutMethod : PayoutMethod.OTHER;

  return (
    <Step title="Reward address">
      <Description>
        {payoutMethod === PayoutMethod.STX ? (
          <Text>
            The address where you&apos;ll receive your STX rewards is your current account.
          </Text>
        ) : (
          <Text>The address where you&apos;ll receive rewards is determined by the pool.</Text>
        )}
      </Description>
    </Step>
  );
}
