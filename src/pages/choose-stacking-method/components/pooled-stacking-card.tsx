import { ExplainerTooltip } from '@components/tooltip';
import { Box, Flex } from '@stacks/ui';
import { IconUser, IconChartLine, IconStairs } from '@tabler/icons-react';
import {
  StackingOptionCard as Card,
  StackingOptionsCardDescription as Description,
  StackingOptionCardBenefit as OptionBenefit,
  StackingOptionCardBenefitContainer as OptionBenefitContainer,
  StackingOptionCardTitle as Title,
} from '../components/start-stacking-layout';
import { ChooseStackingMethodLayoutProps } from '../types';
import { PooledStackingButton } from './pooled-stacking-button';
import { PooledStackingInsufficientStackingBalanceWarning } from './pooled-stacking-insufficient-stacking-balance-warning';
import divingBoardIllustration from '@assets/images/stack-in-a-pool.svg';

export function PooledStackingCard(props: ChooseStackingMethodLayoutProps) {
  return (
    <Card>
      <Box height="130px">
        <img
          src={divingBoardIllustration}
          width="150px"
          alt="Diving board illustration with a blue gradient and ominous-looking hole by Eugenia Digon"
        />
      </Box>
      <Title>Stack in a pool</Title>
      <Description>
        Delegate to a Stacking pool provider, enabling you to stack even if you don&apos;t meet the
        minimum. The Stacking provider may maintain discretion with payment of rewards.
      </Description>

      <OptionBenefitContainer>
        <OptionBenefit icon={IconUser}>A pool stacks on your behalf</OptionBenefit>
        <OptionBenefit icon={IconChartLine}>More predictable returns</OptionBenefit>
        <OptionBenefit icon={IconStairs}>
          <Flex>
            No minimum required
            <Box ml="extra-tight" alignSelf="center">
              <ExplainerTooltip>
                Your chosen pool may set their own minimum amount to participate
              </ExplainerTooltip>
            </Box>
          </Flex>
        </OptionBenefit>
      </OptionBenefitContainer>

      <Flex alignItems="center">
        <PooledStackingButton {...props} />
        <PooledStackingInsufficientStackingBalanceWarning {...props} />
      </Flex>
    </Card>
  );
}
