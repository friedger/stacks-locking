import { Box, Flex, Text, color } from '@stacks/ui';

import { AddNetworkForm } from '@components/add-network-form';
import { BaseDrawer } from '@components/drawer/base-drawer';
import { InfoCard } from '@components/info-card';
import { Caption } from '@components/typography';
import routes from '@constants/routes';
import { useNavigate } from '@hooks/use-navigate';

export const AddNetwork = () => {
  const navigate = useNavigate();
  return (
    <BaseDrawer title={'Add a network'} isShowing onClose={() => navigate(routes.HOME)}>
      <Flex alignItems="center" flexDirection="column" pb={['loose', '48px']} px="loose">
        <InfoCard width="420px">
          <Box m={['loose', 'extra-loose']}>
            <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
              <Text fontSize={'14px'} color={'textBody'}>
                Use this form to add a new instance of the{' '}
                <Caption
                  display="inline"
                  as="a"
                  href="https://github.com/hirosystems/stacks-blockchain-api"
                  target="_blank"
                  color={color('brand')}
                >
                  Stacks Blockchain API
                </Caption>
                . Make sure you review and trust the host before you add it.
              </Text>
            </Flex>
            <AddNetworkForm />
          </Box>
        </InfoCard>
      </Flex>
    </BaseDrawer>
  );
};
