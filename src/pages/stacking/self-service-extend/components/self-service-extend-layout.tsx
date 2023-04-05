import { useState } from 'react';

import { PoxInfo, StackerInfo } from '@stacks/stacking';
import { Box, Button, Flex, Text } from '@stacks/ui';
import { IconLock } from '@tabler/icons-react';

import { BaseDrawer } from '@components/drawer/base-drawer';
import { Hr } from '@components/hr';
import {
  InfoCardGroup as Group,
  InfoCard,
  InfoCardRow as Row,
  InfoCardSection as Section,
} from '@components/info-card';
import routes from '@constants/routes';
import { useNavigate } from '@hooks/use-navigate';
import { formatPoxAddressToNetwork } from '@utils/stacking';
import { toHumanReadableStx } from '@utils/unit-convert';

import { Stacker } from './choose-stacker';
import { StackerDetailsRows } from './stacker-details-rows';

interface SelfServiceLayoutProps {
  stackerInfoDetails: (StackerInfo & { stacked: true })['details'] | undefined;
  lockedBalance: bigint;
  poxInfo: PoxInfo;
  isContractCallExtensionPageOpen: boolean;
}
export function SelfServiceLayout(props: SelfServiceLayoutProps) {
  const { stackerInfoDetails, poxInfo, lockedBalance, isContractCallExtensionPageOpen } = props;
  const [showStackerAddress, setShowStackerAddress] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const poxAddress = stackerInfoDetails
    ? formatPoxAddressToNetwork(stackerInfoDetails.pox_address)
    : undefined;
  const onClose = () => {
    navigate(routes.POOLED_STACKING_INFO);
  };
  const title = stackerInfoDetails ? 'Extend stacking' : 'Stack again';
  const nextRewardCycleId = poxInfo.reward_cycle_id + 1;
  return (
    <BaseDrawer title={title} isShowing onClose={onClose}>
      <Flex alignItems="center" flexDirection="column" pb={['loose', '48px']} px="loose">
        <InfoCard width="420px">
          <Box mx={['loose', 'extra-loose']}>
            <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
              {stackerInfoDetails && !showStackerAddress ? (
                <>
                  <Text textStyle="body.large.medium">You&apos;re stacking</Text>
                  <Text
                    fontSize="24px"
                    fontFamily="Open Sauce"
                    fontWeight={500}
                    letterSpacing="-0.02em"
                    mt="extra-tight"
                  >
                    {toHumanReadableStx(lockedBalance)}
                  </Text>
                </>
              ) : (
                <>
                  <Text textStyle="body.large.medium">Self-service pooling with</Text>
                  <Text
                    fontSize="24px"
                    fontFamily="Open Sauce"
                    fontWeight={500}
                    letterSpacing="-0.02em"
                    mt="extra-tight"
                  >
                    Fast Pool
                  </Text>
                </>
              )}
            </Flex>
            <Hr />
            <Group pt="base-loose">
              <Section>
                {showStackerAddress ? (
                  <Stacker nextRewardCycleId={nextRewardCycleId} preview={showPreview} />
                ) : (
                  <>
                    {stackerInfoDetails && poxAddress && (
                      <>
                        <StackerDetailsRows
                          stackerInfoDetails={stackerInfoDetails}
                          poxAddress={poxAddress}
                        />
                        <Hr />
                      </>
                    )}
                    <Text py="loose">Lock your STX for the 1 more cycle.</Text>
                  </>
                )}
                <Row m="loose" justifyContent="space-between">
                  <Button mode="tertiary" onClick={onClose}>
                    Cancel
                  </Button>
                  {!showStackerAddress || showPreview ? (
                    <Button type="submit" isLoading={isContractCallExtensionPageOpen}>
                      <Box mr="loose">
                        <IconLock />
                      </Box>
                      Lock STX
                    </Button>
                  ) : (
                    <Button
                      onClick={e => {
                        e.preventDefault();
                        setShowPreview(true);
                      }}
                    >
                      Preview
                    </Button>
                  )}
                </Row>
                {!showStackerAddress && (
                  <Row m="loose" justifyContent="space-evenly">
                    <Button mode="tertiary" onClick={() => setShowStackerAddress(true)}>
                      Lock for other pool members
                    </Button>
                  </Row>
                )}
              </Section>
            </Group>
          </Box>
        </InfoCard>
      </Flex>
    </BaseDrawer>
  );
}
