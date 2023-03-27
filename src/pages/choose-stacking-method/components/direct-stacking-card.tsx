import { Box, Flex } from '@stacks/ui';
import { IconLock, IconStairs } from '@tabler/icons-react';
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
import { Unassignee } from '@components/icons/unassignee';

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
      <Title>Stack independently</Title>

      <Description>
        When you stack Independently, you&apos;ll interact with the protocol directly. This approach
        could be suitable if you prefer stacking in a trustless manner and meet the minimum
        requirement
      </Description>

      <OptionBenefitContainer>
        <OptionBenefit icon={IconLock}>Interact with the protocol directly</OptionBenefit>
        <OptionBenefit icon={Unassignee}>No intermediaries</OptionBenefit>

        {/* TODO: this is a small hack to show this last bullet point when the user is not signed in.
        Unfortunately, the StacksClient, which is being used extensively to fetch stacking data,
        requires an address in the constructor, even though some endpoints do not require any
        address info. As such, when the user is not logged in, we must fetch the minimum stacking
        amount directly from the API without using the client. */}
        {props.isSignedIn ? (
          <OptionBenefit icon={IconStairs}>
            Dynamic minimum (currently {toHumanReadableStx(props.stackingMinimumAmountUstx)})
          </OptionBenefit>
        ) : (
          <OptionBenefit icon={IconStairs}>Dynamic minimum</OptionBenefit>
        )}
      </OptionBenefitContainer>

      <Flex alignItems="center">
        <DirectStackingButton {...props} />
        <DirectStackingInsufficientStackingBalanceWarning {...props} />
      </Flex>
    </Card>
  );
}
