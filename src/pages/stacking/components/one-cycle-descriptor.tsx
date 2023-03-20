import { FC } from 'react';

import { ErrorAlert } from '@components/error-alert';
import { useGetPoxInfoQuery } from '@components/stacking-client-provider/stacking-client-provider';
import { BoxProps, Spinner, Text, color } from '@stacks/ui';

type OneCycleDescriptorProps = BoxProps;

export const OneCycleDescriptor: FC<OneCycleDescriptorProps> = props => {
  const q = useGetPoxInfoQuery();

  if (q.isLoading) {
    return <Spinner />;
  }

  if (q.isError || !q.data) {
    const id = 'd447780e-7df2-4953-b409-aef9e91cf2e8';
    const msg = 'Failed to retrieve necessary data.';
    // TODO: log error
    console.error(id, msg);
    return <ErrorAlert id={id}>{msg}</ErrorAlert>;
  }

  return (
    <Text display="block" textStyle="body.small" color={color('text-caption')} {...props}>
      Cycles last {q.data.reward_cycle_length} Bitcoin blocks, currently TODO:time.
    </Text>
  );
};
