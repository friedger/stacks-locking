import { useParams } from 'react-router-dom';

import { Button, Stack } from '@stacks/ui';

import { useAuth } from '@components/auth-provider/auth-provider';
import { CenteredErrorAlert } from '@components/centered-error-alert';
import { CenteredSpinner } from '@components/centered-spinner';
import {
  useGetPoxInfoQuery,
  useGetSecondsUntilNextCycleQuery,
} from '@components/stacking-client-provider/stacking-client-provider';
import routes from '@constants/routes';
import { useNavigate } from '@hooks/use-navigate';

import { StackingFormInfoPanel } from '../../components/stacking-form-info-panel';
import { PoolAdminIntro } from '../components/pool-admin-intro';
import { PoolAdminLayout } from '../components/pool-admin-layout';
import { InfoPanel } from './components/pool-info-card';

export function PoolInfo() {
  let { poolAddress } = useParams();
  const { address } = useAuth();
  if (poolAddress === undefined && address !== null) {
    poolAddress = address;
  }

  const getSecondsUntilNextCycleQuery = useGetSecondsUntilNextCycleQuery();
  const getPoxInfoQuery = useGetPoxInfoQuery();
  const navigate = useNavigate();
  if (getSecondsUntilNextCycleQuery.isLoading || getPoxInfoQuery.isLoading)
    return <CenteredSpinner />;

  if (
    getSecondsUntilNextCycleQuery.isError ||
    typeof getSecondsUntilNextCycleQuery.data !== 'number' ||
    getPoxInfoQuery.isError ||
    !getPoxInfoQuery.data
  ) {
    const msg = 'Failed to load necessary data.';
    const id = '8c12f6b2-c839-4813-8471-b0fd542b845f';
    console.error(id, msg);
    return <CenteredErrorAlert id={id}>{msg}</CenteredErrorAlert>;
  }

  return (
    <PoolAdminLayout
      intro={
        <PoolAdminIntro
          estimatedStackingMinimum={BigInt(getPoxInfoQuery.data.min_amount_ustx)}
          timeUntilNextCycle={getSecondsUntilNextCycleQuery.data}
        >
          Managing a stacking pool usually happens directly through the pox-3 contract. For each
          pool member, who delegated to your pool address, you have to stack their stack and later
          extend and/or increase their locked tokens.
          <br />
          After locking your members&apos; STX, you have to finalized the cycle by calling stack
          aggregation commit.
        </PoolAdminIntro>
      }
      poolAdminPanel={
        <>
          <StackingFormInfoPanel>
            <InfoPanel />
          </StackingFormInfoPanel>
        </>
      }
      poolAdminForm={
        <>
          <Stack spacing="base" mt="extra-loose">
            <Button onClick={() => navigate(routes.DELEGATE_STACK_STX)}>Delegate Stack STX</Button>
            <Button onClick={() => navigate(routes.DELEGATE_STACK_EXTEND)}>
              Delegate Stack Extend
            </Button>
            <Button onClick={() => navigate(routes.DELEGATE_STACK_INCREASE)}>
              Delegate Stack Increase
            </Button>
            <Button onClick={() => navigate(routes.STACK_AGGREGATION_COMMIT)}>
              Stack Aggregation Commit
            </Button>
          </Stack>
        </>
      }
    />
  );
}
