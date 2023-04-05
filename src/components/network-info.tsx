import { Text, color } from '@stacks/ui';
import { NetworkBadge } from 'src/pages/settings/network/network-items';

import routes from '@constants/routes';
import { useNavigate } from '@hooks/use-navigate';
import { useStacksNetwork } from '@hooks/use-stacks-network';

import { Caption } from './typography';

export function NetworkInfo() {
  const { networkName, networkLabel } = useStacksNetwork();
  const navigate = useNavigate();
  return (
    <Caption cursor="pointer" onClick={() => navigate(routes.SETTINGS_NETWORK)}>
      <Text textAlign="center" color={color('text-caption')}>
        {networkLabel}
        <NetworkBadge mode={networkName} />
      </Text>
    </Caption>
  );
}
