import { Link, useNavigate } from 'react-router-dom';

import fishBowlIllustration from '@assets/images/stack-by-yourself.svg';
import divingBoardIllustration from '@assets/images/stack-in-a-pool.svg';

import {
  Flex,
  Text,
  Card,
  Button,
  Container,
  Title,
  Grid,
  Stack,
  List,
  Image,
  Loader,
  Alert,
  Anchor,
} from '@mantine/core';
import { IconChartLine, IconInfoCircle, IconLock, IconUser, IconUserMinus } from '@tabler/icons';
import {
  useGetAccountBalance,
  useGetAccountBalanceLocked,
  useGetPoxInfoQuery,
} from '@components/stacking-client-provider/stacking-client-provider';
import { ErrorAlert } from '@components/error-alert';
import { useDelegationStatusQuery } from '../stacking/pooled-stacking-info/use-delegation-status-query';
import { useStackingInitiatedByQuery } from './use-stacking-initiated-by';
import { useAuth } from '@components/auth-provider/auth-provider';
import { ExternalLink } from '@components/external-link';

export function ChooseStackingMethod() {
  const { address } = useAuth();
  const q1 = useDelegationStatusQuery();
  const q2 = useGetAccountBalanceLocked();
  const q3 = useStackingInitiatedByQuery();
  const q4 = useGetAccountBalance();
  const q5 = useGetPoxInfoQuery();

  if (q1.isLoading || q2.isLoading || q3.isLoading || q4.isLoading || q5.isLoading) {
    return <Loader />;
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

  const hasEnoughBalanceToPool = q4.data > 0;
  const hasEnoughBalanceToDirectStack = q4.data > BigInt(q5.data.min_amount_ustx);

  const isStacking = q2.data !== 0n;
  const hasExistingDelegation = q1.data.isDelegating;
  const hasExistingDelegatedStacking = isStacking && address !== q3.data.address;
  const hasExistingDirectStacking = isStacking && address === q3.data.address;
  return (
    <ChooseStackingMethodInner
      hasExistingDelegation={hasExistingDelegation}
      hasExistingDelegatedStacking={hasExistingDelegatedStacking}
      hasExistingDirectStacking={hasExistingDirectStacking}
      hasEnoughBalanceToPool={hasEnoughBalanceToPool}
      hasEnoughBalanceToDirectStack={hasEnoughBalanceToDirectStack}
    />
  );
}
interface ChooseStackingMethodInnerProps {
  hasExistingDelegation: boolean;
  hasExistingDelegatedStacking: boolean;
  hasExistingDirectStacking: boolean;
  hasEnoughBalanceToPool: boolean;
  hasEnoughBalanceToDirectStack: boolean;
}
export function ChooseStackingMethodInner({
  hasExistingDelegation,
  hasExistingDelegatedStacking,
  hasExistingDirectStacking,
  hasEnoughBalanceToPool,
  hasEnoughBalanceToDirectStack,
}: ChooseStackingMethodInnerProps) {
  const navigate = useNavigate();
  const hasExistingCommitment =
    hasExistingDelegation || hasExistingDelegatedStacking || hasExistingDirectStacking;

  return (
    <Container size="lg">
      <Stack>
        {(hasExistingDelegation || hasExistingDelegatedStacking) && (
          <Alert icon={<IconInfoCircle />}>
            <Stack>
              <Text>
                It appears that you're currently pooling. If you recently revoked your delegation
                after the pool unlocked your funds, you'll soon be able to pool again. This usually
                takes a few seconds.
              </Text>
              <Text>
                <Anchor to="../pooled-stacking-info" component={Link}>
                  View your pooling info.
                </Anchor>
              </Text>
            </Stack>
          </Alert>
        )}
        {hasExistingDirectStacking && (
          <Alert icon={<IconInfoCircle />}>
            <Stack>
              <Text>
                It appears that you're currently stacking. If your locking period recently ended,
                you'll soon be able to stack again.
              </Text>
              <Anchor to="../direct-stacking-info" component={Link}>
                View your stacking info.
              </Anchor>
            </Stack>
          </Alert>
        )}
        {!hasExistingCommitment && !hasEnoughBalanceToPool && !hasEnoughBalanceToDirectStack && (
          <Alert icon={<IconInfoCircle />}>
            <Stack>
              <Text>
                It appears that you don't have enough funds yet. If you recently transferred funds
                to this account, you'll soon be able to stack.{' '}
              </Text>
              <ExternalLink href="#TODO">Consider topping up your account</ExternalLink>
            </Stack>
          </Alert>
        )}
        <Grid>
          <Grid.Col span={6}>
            <Card>
              <Stack>
                <Flex>
                  <Image
                    src={divingBoardIllustration}
                    height="130px"
                    fit="contain"
                    alt="Diving board illustration with a blue gradient and ominous-looking hole by Eugenia Digon"
                  />
                </Flex>
                <Title>Stack in a pool</Title>
                <Text size="lg">
                  Team up with other stackers in a pool, enabling you to stack even if you don't
                  meet the minimum. You have to trust a pool with the payment of your rewards.
                </Text>

                <List>
                  <List.Item icon={<IconUser />}>A pool stacks on your behalf</List.Item>
                  <List.Item icon={<IconChartLine />}>More predictable returns</List.Item>
                </List>

                <Button
                  onClick={() => navigate('../start-pooled-stacking')}
                  disabled={hasExistingCommitment || !hasEnoughBalanceToPool}
                >
                  Stack in a pool
                </Button>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={6}>
            <Card>
              <Stack>
                <Image
                  src={fishBowlIllustration}
                  height="130px"
                  fit="contain"
                  alt="A dark fishbowl with a lone fish facing right, perhaps contemplating the benefits of Stacking, by Eugenia Digon"
                />
                <Title>Stack by yourself</Title>

                <Text size="lg">
                  When you stack by yourself, you’ll interact with the protocol directly. You don’t
                  have to trust a pool if you have a sufficient amount of STX available.
                </Text>

                <List>
                  <List.Item icon={<IconLock />}>Interact with the protocol directly</List.Item>
                  <List.Item icon={<IconUserMinus />}>No intermediaries</List.Item>
                </List>
                {/*   <OptionBenefit icon={StepsIcon}> */}
                {/*     Minimum required to stack is{' '} */}
                {/*     {/* {toHumanReadableStx( */}
                {/*       poxInfo?.paddedMinimumStackingAmountMicroStx || 0 */}
                {/*     )} */}
                {/*   </OptionBenefit> */}

                <Button
                  onClick={() => navigate('../start-direct-stacking')}
                  disabled={hasExistingCommitment || !hasEnoughBalanceToDirectStack}
                >
                  Stack by yourself
                </Button>
                {/* {!meetsMinThresholdForDirectStacking && (
              <InsufficientStackingBalanceWarning />
            )} */}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}
