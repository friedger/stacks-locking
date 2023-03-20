import { Link, useNavigate } from 'react-router-dom';

import { useDelegationStatusQuery } from '../stacking/pooled-stacking-info/use-delegation-status-query';
import {
  StackingOptionCard as Card,
  StackingOptionsCardContainer as CardContainer,
  StackingOptionsCardDescription as Description,
  InsufficientStackingBalanceWarning,
  StartStackingLayout as Layout,
  StackingOptionCardBenefit as OptionBenefit,
  StackingOptionCardBenefitContainer as OptionBenefitContainer,
  StackingOptionCardButton as OptionButton,
  StackingOptionCardTitle as Title,
} from './components/start-stacking-layout';
import { useStackingInitiatedByQuery } from './use-stacking-initiated-by';
import fishBowlIllustration from '@assets/images/stack-by-yourself.svg';
import divingBoardIllustration from '@assets/images/stack-in-a-pool.svg';
import { Alert } from '@components/alert';
import { useAuth } from '@components/auth-provider/auth-provider';
import { ErrorAlert } from '@components/error-alert';
import { ExternalLink } from '@components/external-link';
import {
  useGetAccountBalance,
  useGetAccountBalanceLocked,
  useGetPoxInfoQuery,
} from '@components/stacking-client-provider/stacking-client-provider';
import { pseudoBorderLeft } from '@components/styles/pseudo-border-left';
import { ExplainerTooltip } from '@components/tooltip';
import { Caption } from '@components/typography';
import { BUY_STACKS_URL } from '@constants/app';
import { Box, Flex, Spinner, Stack, Text, color, useMediaQuery } from '@stacks/ui';
import {
  IconChartLine,
  IconInfoCircle,
  IconLock,
  IconStairs,
  IconUser,
  IconUserMinus,
} from '@tabler/icons-react';
import { toHumanReadableStx } from '@utils/unit-convert';

export function ChooseStackingMethod() {
  const { address } = useAuth();
  const q1 = useDelegationStatusQuery();
  const q2 = useGetAccountBalanceLocked();
  const q3 = useStackingInitiatedByQuery();
  const q4 = useGetAccountBalance();
  const q5 = useGetPoxInfoQuery();

  if (q1.isLoading || q2.isLoading || q3.isLoading || q4.isLoading || q5.isLoading) {
    return <Spinner />;
  }

  if (
    q1.isError ||
    !q1.data ||
    q2.isError ||
    typeof q2.data !== 'bigint' ||
    q3.isError ||
    !q3.data ||
    q4.isError ||
    typeof q4.data !== 'bigint' ||
    q5.isError ||
    !q5.data
  ) {
    const msg = 'Error retrieving stacking or delegation info.';
    const id = 'beae38f3-59fb-4e0f-abdc-b837e2b6ebde';
    console.error(id, msg, q1, q2, q3, q4, q5);
    return <ErrorAlert id={id}>{msg}</ErrorAlert>;
  }

  const stackingMinimumAmountUstx = BigInt(q5.data.min_amount_ustx);
  const hasEnoughBalanceToPool = q4.data > 0;
  const hasEnoughBalanceToDirectStack = q4.data > stackingMinimumAmountUstx;

  const isStacking = q2.data !== 0n;
  const hasExistingDelegation = q1.data.isDelegating;
  const hasExistingDelegatedStacking = isStacking && address !== q3.data.address;
  const hasExistingDirectStacking = isStacking && address === q3.data.address;
  return (
    <ChooseStackingMethodLayout
      hasExistingDelegation={hasExistingDelegation}
      hasExistingDelegatedStacking={hasExistingDelegatedStacking}
      hasExistingDirectStacking={hasExistingDirectStacking}
      hasEnoughBalanceToPool={hasEnoughBalanceToPool}
      hasEnoughBalanceToDirectStack={hasEnoughBalanceToDirectStack}
      stackingMinimumAmountUstx={stackingMinimumAmountUstx}
    />
  );
}
interface ChooseStackingMethodInnerProps {
  hasExistingDelegation: boolean;
  hasExistingDelegatedStacking: boolean;
  hasExistingDirectStacking: boolean;
  hasEnoughBalanceToPool: boolean;
  hasEnoughBalanceToDirectStack: boolean;
  stackingMinimumAmountUstx: bigint;
}
function ChooseStackingMethodLayout({
  hasExistingDelegation,
  hasExistingDelegatedStacking,
  hasExistingDirectStacking,
  hasEnoughBalanceToPool,
  hasEnoughBalanceToDirectStack,
  stackingMinimumAmountUstx,
}: ChooseStackingMethodInnerProps) {
  const navigate = useNavigate();
  const hasExistingCommitment =
    hasExistingDelegation || hasExistingDelegatedStacking || hasExistingDirectStacking;

  const [columnBreakpoint] = useMediaQuery('(min-width: 991px)');
  return (
    <Layout>
      <Stack>
        {(hasExistingDelegation || hasExistingDelegatedStacking) && (
          <Alert icon={<IconInfoCircle />}>
            <Stack>
              <Text>
                It appears that you&apos;re currently pooling. If you recently revoked your
                delegation after the pool unlocked your funds, you&apos;ll soon be able to pool
                again. This usually takes a few seconds.
              </Text>
              <Text>
                <Caption color={color('brand')} to="../pooled-stacking-info" as={Link}>
                  View your pooling info.
                </Caption>
              </Text>
            </Stack>
          </Alert>
        )}
        {hasExistingDirectStacking && (
          <Alert icon={<IconInfoCircle />}>
            <Stack>
              <Text>
                It appears that you&apos;re currently stacking. If your locking period recently
                ended, you&apos;ll soon be able to stack again.
              </Text>
              <Caption color={color('brand')} to="../direct-stacking-info" as={Link}>
                View your stacking info.
              </Caption>
            </Stack>
          </Alert>
        )}
        {!hasExistingCommitment && !hasEnoughBalanceToPool && !hasEnoughBalanceToDirectStack && (
          <Alert icon={<IconInfoCircle />}>
            <Stack>
              <Text>
                It appears that you don&apos;t have enough funds yet. If you recently transferred
                funds to this account, you&apos;ll soon be able to stack.{' '}
              </Text>
              <ExternalLink href={BUY_STACKS_URL}>Consider topping up your account</ExternalLink>
            </Stack>
          </Alert>
        )}
        <CardContainer>
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
              Team up with other stackers in a pool, enabling you to stack even if you don&apos;t
              meet the minimum. You have to trust a pool with the payment of your rewards.
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
              <OptionButton
                onClick={() => navigate('../start-pooled-stacking')}
                isDisabled={hasExistingCommitment || !hasEnoughBalanceToPool}
              >
                Stack in a pool
              </OptionButton>
              {!hasEnoughBalanceToPool && <InsufficientStackingBalanceWarning />}
            </Flex>
          </Card>

          <Card
            mt={['extra-loose', null, null, 'unset']}
            {...(columnBreakpoint ? pseudoBorderLeft('border', '1px') : {})}
          >
            <Box height="130px">
              <img
                src={fishBowlIllustration}
                width="150px"
                alt="A dark fishbowl with a lone fish facing right, perhaps contemplating the benefits of Stacking, by Eugenia Digon"
              />
            </Box>
            <Title>Stack by yourself</Title>

            <Description>
              When you stack by yourself, you’ll interact with the protocol directly. You don’t have
              to trust a pool if you have a sufficient amount of STX available.
            </Description>

            <OptionBenefitContainer>
              <OptionBenefit icon={IconLock}>Interact with the protocol directly</OptionBenefit>
              <OptionBenefit icon={IconUserMinus}>No intermediaries</OptionBenefit>
              <OptionBenefit icon={IconStairs}>
                Minimum required to stack is {toHumanReadableStx(stackingMinimumAmountUstx)}
              </OptionBenefit>
            </OptionBenefitContainer>

            <Flex alignItems="center">
              <OptionButton
                onClick={() => navigate('../start-direct-stacking')}
                isDisabled={hasExistingCommitment || !hasEnoughBalanceToDirectStack}
              >
                Stack by yourself
              </OptionButton>
              {!hasEnoughBalanceToDirectStack && <InsufficientStackingBalanceWarning />}
            </Flex>
          </Card>
        </CardContainer>
      </Stack>
    </Layout>
  );
}
