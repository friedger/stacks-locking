import { Description, Step } from '../../components/stacking-form-step';
import { Pool, PoolName, Pox2Contracts } from '../types-preset-pools';
import { PoolSelectItem } from './pool-select-item';
import { pools } from './preset-pools';
import { ExternalLink } from '@components/external-link';
import { Stack, Text } from '@stacks/ui';
import { useField } from 'formik';

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
          <ExternalLink href="https://www.stacks.co/learn/stacking">
            discover others on stacks.co.
          </ExternalLink>
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
