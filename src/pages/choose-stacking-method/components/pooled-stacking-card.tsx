import { Box, Flex } from '@stacks/ui';
import { IconStairs } from '@tabler/icons-react';

import divingBoardIllustration from '@assets/images/stack-in-a-pool.svg';
import { Users } from '@components/icons/users';

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
        <OptionBenefit icon={Users}>A pool stacks on your behalf</OptionBenefit>
        <OptionBenefit icon={IconStairs}>No minimum required</OptionBenefit>

        {/* This is just a hack to get the correct allignment for the CTA button */}
        <OptionBenefit icon={() => null}>&nbsp;</OptionBenefit>
      </OptionBenefitContainer>

      <Flex alignItems="center">
        <PooledStackingButton {...props} />
        <PooledStackingInsufficientStackingBalanceWarning {...props} />
      </Flex>
    </Card>
  );
}
