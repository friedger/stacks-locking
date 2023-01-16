import { Navigate, useNavigate } from 'react-router-dom';

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
  Box,
  Code,
} from '@mantine/core';
import { IconChartLine, IconLock, IconUser, IconUserMinus } from '@tabler/icons';
import {
  useGetAccountBalanceLocked,
  useGetStatusQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';
import { ErrorAlert } from '@components/error-alert';
import { StackingClient } from '@stacks/stacking';
import { useDelegationStatusQuery } from '../stacking/pooled-stacking-info/use-delegation-status-query';

export function ChooseStackingMethod() {
  const q1 = useDelegationStatusQuery();
  const q2 = useGetAccountBalanceLocked();

  if (q1.isLoading || q2.isLoading) {
    return <Loader />;
  }

  if (q1.isError || !q1.data || q2.isError || typeof q2.data !== 'bigint') {
    const msg = 'Error retrieving stacking or delegation info.';
    const id = 'beae38f3-59fb-4e0f-abdc-b837e2b6ebde';
    console.error(id, msg, q1, q2);
    return <ErrorAlert id={id}>{msg}</ErrorAlert>;
  }

  // Checking for delegation first ensures user can be correctly redirected to appropriate page when
  // later checking for a locked balance.
  // TODO: temporarily removing redirects
  /* if (q1.data?.isDelegating) { */
  /*   return <Navigate to="../pooled-stacking-info" />; */
  /* } */
  /* if (q2.data !== 0n) { */
  /*   return <Navigate to="../direct-stacking-info" />; */
  /* } */

  return <ChooseStackingMethodInner />;
}
export function ChooseStackingMethodInner() {
  const navigate = useNavigate();
  return (
    <Container size="lg">
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
                Team up with other stackers in a pool, enabling you to stack even if you don't meet
                the minimum. You have to trust a pool with the payment of your rewards.
              </Text>

              <List>
                <List.Item icon={<IconUser />}>A pool stacks on your behalf</List.Item>
                <List.Item icon={<IconChartLine />}>More predictable returns</List.Item>
              </List>
              {/* <OptionBenefit icon={StepsIcon}> */}
              {/*     <Flex> */}
              {/*       No minimum required */}
              {/*       <Box ml="extra-tight" alignSelf="center"> */}
              {/*         <ExplainerTooltip> */}
              {/*           Your chosen pool may set their own minimum amount to participate */}
              {/*         </ExplainerTooltip> */}
              {/*       </Box> */}
              {/*     </Flex> */}
              {/*   </OptionBenefit> */}

              <Button
                onClick={() => navigate('../start-pooled-stacking')}
                // isDisabled={
                //   !hasSufficientBalanceToCoverPoolingTxFee && !holdingAltKey
                // }
              >
                Stack in a pool
              </Button>
              {/* {!hasSufficientBalanceToCoverPoolingTxFee && (
              <InsufficientStackingBalanceWarning />
            )} */}
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
                disabled
                // onClick={() => history.push(routes.STACKING)}
                // isDisabled={!meetsMinThresholdForDirectStacking && !holdingAltKey}
              >
                Stack by yourself (coming soon)
              </Button>
              {/* {!meetsMinThresholdForDirectStacking && (
              <InsufficientStackingBalanceWarning />
            )} */}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
