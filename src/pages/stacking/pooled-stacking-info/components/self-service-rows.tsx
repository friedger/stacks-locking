import { Button } from '@stacks/ui';

import {
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardValue as Value,
} from '@components/info-card';
import {
  useGetCoreInfoQuery,
  useGetPoxInfoQuery,
} from '@components/stacking-client-provider/stacking-client-provider';
import routes from '@constants/routes';
import { useNavigate } from '@hooks/use-navigate';

import { nextExtendWindow } from '../../self-service-extend/utils';

export function SelfServiceRows() {
  const navigate = useNavigate();
  const getPoxInfoQuery = useGetPoxInfoQuery();
  const getCoreInfoQuery = useGetCoreInfoQuery();
  const burnBlockHeight = getCoreInfoQuery.data?.burn_block_height;

  if (!getPoxInfoQuery.data || !burnBlockHeight) {
    return <></>;
  }
  const { extendWindow, tooEarly, tooLate } = nextExtendWindow(
    burnBlockHeight,
    getPoxInfoQuery.data
  );
  return (
    <>
      {tooEarly || tooLate ? (
        <Row>
          <Label>Extend to cycle {getPoxInfoQuery.data.current_cycle.id + 1} in</Label>
          <Value>{extendWindow.blocksUntilStart} blocks</Value>
        </Row>
      ) : (
        <Row>
          <Label>Time left to extend</Label>
          <Value>{extendWindow.blocksUntilEnd} blocks</Value>
        </Row>
      )}
      <Row justifyContent="space-evenly">
        <Button
          isDisabled={tooEarly || tooLate}
          onClick={() => navigate(routes.SELF_SERVICE_EXTEND)}
        >
          Extend pooled stacking
        </Button>
      </Row>
    </>
  );
}
