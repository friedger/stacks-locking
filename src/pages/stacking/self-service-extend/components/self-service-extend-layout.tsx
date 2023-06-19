import { useState } from 'react';

import { PoxInfo } from '@stacks/stacking';
import { Box, Flex } from '@stacks/ui';
import { StackerInfoDetails } from 'src/types/stacking';

import { BaseDrawer } from '@components/drawer/base-drawer';
import { Hr } from '@components/hr';
import {
  InfoCardGroup as Group,
  InfoCard,
  InfoCardSection as Section,
} from '@components/info-card';
import routes from '@constants/routes';
import { useNavigate } from '@hooks/use-navigate';
import { useSIP22 } from '@hooks/use-sip-22';

import { ExtendForCurrentUser } from './extend-for-current-user';
import { ExtendForOtherUser } from './extend-for-other-user';
import { SelfServiceExtendHeader } from './self-service-extend-header';

interface SelfServiceLayoutProps {
  currentUser: string;
  stackerInfoDetails: StackerInfoDetails | undefined;
  lockedBalance: bigint;
  poxInfo: PoxInfo;
  isContractCallExtensionPageOpen: boolean;
}
export function SelfServiceLayout(props: SelfServiceLayoutProps) {
  const {
    currentUser,
    stackerInfoDetails,
    poxInfo,
    lockedBalance,
    isContractCallExtensionPageOpen,
  } = props;
  const [showExtendForOtherUser, setShowExtendForOtherUser] = useState(false);
  const navigate = useNavigate();
  const { poxDisabled } = useSIP22();

  const onClose = () => {
    navigate(routes.POOLED_STACKING_INFO);
  };
  const title = stackerInfoDetails ? 'Extend stacking' : 'Stack again';
  return (
    <BaseDrawer title={title} isShowing={!poxDisabled} onClose={onClose}>
      <Flex alignItems="center" flexDirection="column" pb={['loose', '48px']} px="loose">
        <InfoCard width="420px">
          <Box mx={['loose', 'extra-loose']}>
            <SelfServiceExtendHeader
              stackerInfoDetails={stackerInfoDetails}
              showExtendForOtherUser={showExtendForOtherUser}
              lockedBalance={lockedBalance}
            />
            <Hr />
            <Group pt="base-loose">
              <Section>
                {showExtendForOtherUser ? (
                  <ExtendForOtherUser
                    onClose={onClose}
                    isContractCallExtensionPageOpen={isContractCallExtensionPageOpen}
                  />
                ) : (
                  <ExtendForCurrentUser
                    poxInfo={poxInfo}
                    address={currentUser}
                    stackerInfoDetails={stackerInfoDetails}
                    onClose={onClose}
                    isContractCallExtensionPageOpen={isContractCallExtensionPageOpen}
                    setShowExtendForOtherUser={setShowExtendForOtherUser}
                  />
                )}
              </Section>
            </Group>
          </Box>
        </InfoCard>
      </Flex>
    </BaseDrawer>
  );
}
