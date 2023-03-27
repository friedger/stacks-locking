import { pseudoBorderLeft } from '@components/styles/pseudo-border-left';
import { useMediaQuery, Box, Flex } from '@stacks/ui';
import { IconLock, IconUserMinus, IconStairs } from '@tabler/icons-react';
import { toHumanReadableStx } from '@utils/unit-convert';
import { ChooseStackingMethodLayoutProps } from '../types';
import { DirectStackingInsufficientStackingBalanceWarning } from './direct-stacking-insufficient-stacking-balance-warning';
import {
  StackingOptionCard as Card,
  StackingOptionsCardDescription as Description,
  StackingOptionCardBenefit as OptionBenefit,
  StackingOptionCardBenefitContainer as OptionBenefitContainer,
  StackingOptionCardTitle as Title,
} from '../components/start-stacking-layout';
import fishBowlIllustration from '@assets/images/stack-by-yourself.svg';
import { DirectStackingButton } from './direct-stacking-button';

export function DirectStackingCard(props: ChooseStackingMethodLayoutProps) {
  return (
    <Card mt={['extra-loose', null, null, 'unset']}>
      <Box height="130px">
        <img
          src={fishBowlIllustration}
          width="150px"
          alt="A dark fishbowl with a lone fish facing right, perhaps contemplating the benefits of Stacking, by Eugenia Digon"
        />
      </Box>
      <Title>Stack by yourself</Title>

      <Description>
        When you stack by yourself, you&apos;ll interact with the protocol directly. You don&apos;t
        have to trust a pool if you have a sufficient amount of STX available.
      </Description>

      <OptionBenefitContainer>
        <OptionBenefit icon={IconLock}>Interact with the protocol directly</OptionBenefit>
        <OptionBenefit icon={IconUserMinus}>No intermediaries</OptionBenefit>

        {/* TODO: this is a small hack to show this last bullet point when the user is not signed in.
        Unfortunately, the StacksClient, which is being used extensively to fetch stacking data,
        requires an address in the constructor, even though some endpoints do not require any
        address info. As such, when the user is not logged in, we must fetch the minimum stacking
        amount directly from the API without using the client. */}
        {props.isSignedIn ? (
          <OptionBenefit icon={IconStairs}>
            Minimum required to stack is {toHumanReadableStx(props.stackingMinimumAmountUstx)}
          </OptionBenefit>
        ) : (
          <OptionBenefit icon={IconStairs}>Minimum stacking amount required</OptionBenefit>
        )}
      </OptionBenefitContainer>

      <Flex alignItems="center">
        <DirectStackingButton {...props} />
        <DirectStackingInsufficientStackingBalanceWarning {...props} />
      </Flex>
    </Card>
  );
}
