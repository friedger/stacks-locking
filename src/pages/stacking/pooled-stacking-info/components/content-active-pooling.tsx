import { useState } from 'react';

import { AccountExtendedBalances, StackerInfo } from '@stacks/stacking';
import { Box, Button, Text, color } from '@stacks/ui';

import { Address } from '@components/address';
import { OpenExternalLinkInNewTab } from '@components/external-link';
import { Hr } from '@components/hr';
import { CancelIcon } from '@components/icons/cancel';
import {
  InfoCardGroup as Group,
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardSection as Section,
  InfoCardValue as Value,
} from '@components/info-card';
import { useStacksNetwork } from '@hooks/use-stacks-network';
import { makeStackingClubRewardAddressLink } from '@utils/external-links';
import { toHumanReadableStx } from '@utils/unit-convert';

import { PoxContractName } from '../../start-pooled-stacking/types-preset-pools';
import { getPox3Contracts } from '../../start-pooled-stacking/utils-preset-pools';
import { DelegationStatus } from '../get-delegation-status';
import { IncreasePoolingAmount } from './increase-pooling-amount';
import { PercentageRow } from './percentage-row';
import { SelfServiceRows } from './self-service-rows';

interface ActivePoolingContentProps {
  delegationStatusDetails: (DelegationStatus & { isDelegating: true })['details'];
  isStacking: boolean;
  poolAddress: string;
  isContractCallExtensionPageOpen: boolean;
  stackerInfo: StackerInfo;
  extendedStxBalance: AccountExtendedBalances['stx'];
  handleStopPoolingClick: () => void;
}
export function ActivePoolingContent({
  delegationStatusDetails,
  poolAddress,
  isContractCallExtensionPageOpen,
  handleStopPoolingClick,
  extendedStxBalance,
  stackerInfo,
}: ActivePoolingContentProps) {
  const isStacking = stackerInfo.stacked;
  const [showIncreasePoolingAmount, setShowIncreasePoolingAmount] = useState(false);
  const { network } = useStacksNetwork();
  const isSelfService =
    delegationStatusDetails.delegatedTo ===
    getPox3Contracts(network)[PoxContractName.WrapperFastPool];
  return (
    <>
      <Text textStyle="body.large.medium">You&apos;re pooling</Text>
      <Text
        fontSize="24px"
        fontFamily="Open Sauce"
        fontWeight={500}
        letterSpacing="-0.02em"
        mt="extra-tight"
        mb="extra-loose"
      >
        {toHumanReadableStx(delegationStatusDetails.amountMicroStx)}
      </Text>

      <Hr />

      <Group my="extra-loose">
        <Section>
          <Row>
            <Label>Status</Label>
            <Value color={isStacking ? 'green' : color('text-caption')}>
              {isStacking ? 'Active' : 'Waiting on pool'}
            </Value>
          </Row>
          <PercentageRow extendedStxBalances={extendedStxBalance} />
          <Row>
            <Label>Type</Label>
            <Value>
              {delegationStatusDetails.untilBurnHeight
                ? 'Limted permission'
                : 'Indefinite permission'}
            </Value>
          </Row>
          <Row>
            <Label>Pool address</Label>
            <Value>
              <Address address={poolAddress} />
            </Value>
          </Row>
          {isSelfService && !showIncreasePoolingAmount && <SelfServiceRows />}
          {showIncreasePoolingAmount ? (
            <IncreasePoolingAmount
              handleStopPoolingClick={() => {
                setShowIncreasePoolingAmount(false);
                handleStopPoolingClick();
              }}
              handleKeepPoolingClick={() => setShowIncreasePoolingAmount(false)}
            />
          ) : (
            <Row justifyContent="space-evenly">
              <Button mode="tertiary" onClick={() => setShowIncreasePoolingAmount(true)}>
                Increase pooling amount
              </Button>
            </Row>
          )}
        </Section>
      </Group>

      <Hr />

      <Group my="extra-loose">
        <Section>
          <Row>
            <Label>
              <OpenExternalLinkInNewTab
                href={makeStackingClubRewardAddressLink(poolAddress)}
                color={color('text-caption')}
              >
                🥞 View on stacking.club
              </OpenExternalLinkInNewTab>
            </Label>
          </Row>
          {!showIncreasePoolingAmount && (
            <Row>
              <Label>
                <Button
                  variant="link"
                  isDisabled={isContractCallExtensionPageOpen}
                  onClick={() => {
                    handleStopPoolingClick();
                  }}
                  color={color('text-caption')}
                >
                  <Box pr="tight">
                    <CancelIcon />
                  </Box>{' '}
                  Stop pooling
                </Button>
              </Label>
            </Row>
          )}
        </Section>
      </Group>
    </>
  );
}
