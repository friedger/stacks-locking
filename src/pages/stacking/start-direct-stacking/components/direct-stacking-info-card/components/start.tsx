import {
  useGetPoxInfoQuery,
  useGetSecondsUntilNextCycleQuery,
} from '@components/stacking-client-provider/stacking-client-provider';
import { Group, Loader, Text } from '@mantine/core';
import { addSeconds, formatDistanceToNow } from 'date-fns';

export function Start() {
  const getPoxInfoQuery = useGetPoxInfoQuery();
  const getSecondsUntilNextCycleQuery = useGetSecondsUntilNextCycleQuery();

  const isLoading = getPoxInfoQuery.isLoading || getSecondsUntilNextCycleQuery.isLoading;

  if (
    getPoxInfoQuery.isError ||
    !getPoxInfoQuery.data ||
    getSecondsUntilNextCycleQuery.isError ||
    typeof getSecondsUntilNextCycleQuery.data !== 'number'
  ) {
    // TODO log error
    return null;
  }

  return (
    <Group position="apart">
      <Text>Start</Text>
      {isLoading ? (
        <Loader />
      ) : (
        <Text>
          Cycle {getPoxInfoQuery.data.next_cycle.id} ~ in{' '}
          {formatDistanceToNow(addSeconds(new Date(), getSecondsUntilNextCycleQuery.data))}
        </Text>
      )}
    </Group>
  );
}
