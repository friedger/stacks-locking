import { Description, Step } from '../../components/stacking-form-step';
import { PoolName } from '../types-preset-pools';
import { PoolSelectItem } from './pool-select-item';
import { pools } from './preset-pools';
import { Stack, Text } from '@stacks/ui';
import { useField } from 'formik';
import { OpenExternalLinkInNewTab } from '@components/external-link';

interface ChoosePoolingPoolProps {
  onPoolChange: (val: PoolName) => void;
}
export function ChoosePoolingPool({ onPoolChange }: ChoosePoolingPoolProps) {
  const [fieldPoolName, , helpersPoolName] = useField('poolName');
  const onChange = (poolName: PoolName) => {
    helpersPoolName.setValue(poolName);
    onPoolChange(poolName);
  };
  return (
    <Step title="Pool">
      <Description>
        <Text>
          Select a pool to start stacking or{' '}
          <OpenExternalLinkInNewTab display="inline" href="https://www.stacks.co/learn/stacking">
            discover others on stacks.co.
          </OpenExternalLinkInNewTab>
        </Text>
      </Description>

      <Stack spacing="base" mt="extra-loose">
        {(Object.keys(pools) as PoolName[]).map((poolName: PoolName, index: number) => {
          const p = pools[poolName];
          return (
            <PoolSelectItem
              name={p.name}
              icon={p.icon}
              description={p.description}
              url={p.website}
              key={index}
              activePoolName={fieldPoolName.value}
              onChange={onChange}
            />
          );
        })}
      </Stack>
    </Step>
  );
}
