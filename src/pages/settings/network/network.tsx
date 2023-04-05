import { Flex } from '@stacks/ui';

import { BaseDrawer } from '@components/drawer/base-drawer';
import { InfoCard } from '@components/info-card';
import routes from '@constants/routes';
import { useNavigate } from '@hooks/use-navigate';

import { NetworkItems } from './network-items';

export const Network = () => {
  const navigate = useNavigate();
  return (
    <BaseDrawer
      title={'Select network'}
      isShowing
      onClose={() => {
        navigate(routes.HOME);
      }}
    >
      <Flex alignItems="center" flexDirection="column" pb={['loose', '48px']} px="loose">
        <InfoCard width="420px">
          <NetworkItems />
        </InfoCard>
      </Flex>
    </BaseDrawer>
  );
};
