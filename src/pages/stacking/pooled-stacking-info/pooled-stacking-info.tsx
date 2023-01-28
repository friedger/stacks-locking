import { useState } from "react";

import {
  Alert,
  Anchor,
  Box,
  Button,
  Card,
  Code,
  Divider,
  Group,
  Image,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { closeModal } from "@mantine/modals";
import { intToBigInt } from "@stacks/common";
import { ContractCallRegularOptions, openContractCall } from "@stacks/connect";
import { StackingClient } from "@stacks/stacking";
import { IconBan, IconInfoCircle } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";

import pooledStackingImg from "@assets/images/pooled-stacking-swimming-pool.svg";
import { Address } from "@components/address";
import { ErrorAlert } from "@components/error-alert";
import {
  useGetAccountExtendedBalancesQuery,
  useGetCoreInfoQuery,
  useGetStatusQuery,
  useStackingClient,
} from "@components/stacking-client-provider/stacking-client-provider";
import { toHumanReadableStx } from "@utils/unit-convert";

import { RevokeDelegationModal } from "./components/modal";
import { useDelegationStatusQuery } from "./use-delegation-status-query";
import { useGetPoolAddress } from "./use-get-pool-address-query";

export function PooledStackingInfo() {
  const { client } = useStackingClient();
  if (!client) {
    const msg = "Expected `client` to be defined.";
    console.error(msg);
    return (
      <ErrorAlert id="6f080d24-1e87-45ab-b8f7-41ba9bd53e97">{msg}</ErrorAlert>
    );
  }

  return <PooledStackingInfoLayout client={client} />;
}

interface CardLayoutProps {
  client: StackingClient;
}
function PooledStackingInfoLayout({ client }: CardLayoutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContractCallExtensionPageOpen, setIsContractCallExtensionPageOpen] =
    useState(false);
  const navigate = useNavigate();
  const delegationStatusQuery = useDelegationStatusQuery();
  const getStatusQuery = useGetStatusQuery();
  const getAccountExtendedBalancesQuery = useGetAccountExtendedBalancesQuery();
  const getCoreInfoQuery = useGetCoreInfoQuery();
  const getPoolAddressQuery = useGetPoolAddress();

  if (
    delegationStatusQuery.isLoading ||
    getStatusQuery.isLoading ||
    getAccountExtendedBalancesQuery.isLoading ||
    getCoreInfoQuery.isLoading ||
    getPoolAddressQuery.isLoading ||
    getPoolAddressQuery.isFetching
  ) {
    return <Loader />;
  }

  if (
    delegationStatusQuery.isError ||
    !delegationStatusQuery.data ||
    getStatusQuery.isError ||
    !getStatusQuery.data ||
    getAccountExtendedBalancesQuery.isError ||
    !getAccountExtendedBalancesQuery.data ||
    getPoolAddressQuery.isError ||
    !getPoolAddressQuery.data ||
    getCoreInfoQuery.isError ||
    !getCoreInfoQuery.data
  ) {
    const msg = "Error while loading data, try reloading the page.";
    console.error(msg);
    return (
      <ErrorAlert id="0abc083b-06c7-4795-8491-68264595f1b4">
        <>
          <Text>{msg}</Text>
          <Code block>
            {JSON.stringify(
              {
                delegationStatusQuery,
                getStatusQuery,
                getAccountExtendedBalancesQuery,
                getCoreInfoQuery,
                getPoolAddressQuery,
              },
              null,
              2
            )}
          </Code>
        </>
      </ErrorAlert>
    );
  }

  const isStacking = getStatusQuery.data.stacked;
  const poolAddress = getPoolAddressQuery.data.address;

  if (
    (!delegationStatusQuery.data.isDelegating && !isStacking) ||
    !poolAddress
  ) {
    return (
      <Card withBorder w="400px">
        <Alert icon={<IconInfoCircle />}>
          <Stack>
            <Text>
              It appears that you're not pooling yet. If you recently started to
              pool, your pooling info will appear here in a few seconds.
            </Text>
            <Text>
              You may want to{" "}
              <Anchor to="../start-pooled-stacking" component={Link}>
                start pooling
              </Anchor>{" "}
              or{" "}
              <Anchor to="../choose-stacking-method" component={Link}>
                choose your stacking method
              </Anchor>
              .
            </Text>
          </Stack>
        </Alert>
      </Card>
    );
  }

  let lockingProgressPercentString = "0";
  if (getStatusQuery.data.stacked) {
    const cycleLengthInBlocks =
      getAccountExtendedBalancesQuery.data.stx.burnchain_unlock_height -
      getAccountExtendedBalancesQuery.data.stx.burnchain_lock_height;

    const blocksUntilUnlocked =
      getAccountExtendedBalancesQuery.data.stx.burnchain_unlock_height -
      getCoreInfoQuery.data.burn_block_height;

    lockingProgressPercentString = Math.max(
      ((cycleLengthInBlocks - blocksUntilUnlocked) / cycleLengthInBlocks) * 100,
      0
    ).toFixed(2);
  }

  async function handleStopPoolingClick() {
    const stackingContract = await client.getStackingContract();
    const revokeDelegationOptions =
      client.getRevokeDelegateStxOptions(stackingContract);
    setIsContractCallExtensionPageOpen(true);
    openContractCall({
      // Type coercion necessary because the `network` property returned by
      // `client.getStackingContract()` has a wider type than allowed by `openContractCall`. Despite
      // the wider type, the actual value of `network` is always of the type `StacksNetwork`
      // expected by `openContractCall`.
      //
      // See
      // https://github.com/hirosystems/stacks.js/blob/0e1f9f19dfa45788236c9e481f9a476d9948d86d/packages/stacking/src/index.ts#L1054
      ...(revokeDelegationOptions as ContractCallRegularOptions),
      onCancel() {
        setIsContractCallExtensionPageOpen(false);
      },
      onFinish() {
        setIsContractCallExtensionPageOpen(false);
        navigate("../choose-stacking-method");
      },
    });
  }
  return (
    <>
      <Card withBorder w="400px">
        <Stack>
          <Image
            fit="contain"
            height="100px"
            width="130px"
            src={pooledStackingImg}
            alt="Colourful illustration of a diving board protruding out of a blue hole"
          />

          {delegationStatusQuery.data.isDelegating &&
            !delegationStatusQuery.data.isExpired && (
              <>
                <Stack>
                  <Box>
                    <Title order={4}>You're pooling</Title>
                    <Text fz="34px">
                      {toHumanReadableStx(
                        delegationStatusQuery.data.amountMicroStx
                      )}
                    </Text>
                  </Box>

                  <Divider />

                  <Stack>
                    <Group position="apart">
                      <Text>Status</Text>
                      <Text c={isStacking ? "green" : undefined}>
                        {isStacking ? "Active" : "Waiting on pool"}
                      </Text>
                    </Group>
                    <Group position="apart">
                      <Text>Type</Text>
                      <Text>
                        {delegationStatusQuery.data.untilBurnHeight
                          ? "One time"
                          : "Indefinite"}
                      </Text>
                    </Group>
                    <Group position="apart">
                      <Text>Progress</Text>
                      <Text>{lockingProgressPercentString}%</Text>
                    </Group>

                    <Divider />

                    <Group position="apart">
                      <Text>Pool address</Text>
                      <Address address={poolAddress} />
                    </Group>

                    <Divider />

                    <Button
                      leftIcon={<IconBan size={14} />}
                      variant="light"
                      disabled={isContractCallExtensionPageOpen}
                      onClick={() => {
                        setIsModalOpen(true);
                      }}
                    >
                      Stop pooling
                    </Button>
                  </Stack>
                </Stack>
              </>
            )}

          {delegationStatusQuery.data.isDelegating &&
            delegationStatusQuery.data.isExpired && (
              <Box>
                <Title>You've finished pooling</Title>
                <Text>
                  Revoke the pool's permission to stack on your behalf to start
                  stacking again.
                </Text>
                <Box>
                  <Button
                    disabled={isContractCallExtensionPageOpen}
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  >
                    Revoke permission
                  </Button>
                </Box>
              </Box>
            )}

          {!delegationStatusQuery.data.isDelegating && (
            <>
              <Stack>
                <Box>
                  <Title order={4}>You're pooling</Title>
                  <Text fz="34px">
                    {toHumanReadableStx(
                      intToBigInt(
                        getAccountExtendedBalancesQuery.data.stx.locked,
                        false
                      )
                    )}
                  </Text>
                </Box>

                <Divider />

                <Stack>
                  <Group position="apart">
                    <Text>Status</Text>
                    <Text c={isStacking ? "green" : undefined}>
                      {isStacking ? "Active" : "Waiting on pool"}
                    </Text>
                  </Group>
                  <Group position="apart">
                    <Text>Type</Text>
                    <Text>
                      {delegationStatusQuery.data.untilBurnHeight
                        ? "One time"
                        : "Indefinite"}
                    </Text>
                  </Group>
                  <Group position="apart">
                    <Text>Progress</Text>
                    <Text>{lockingProgressPercentString}%</Text>
                  </Group>

                  <Divider />

                  {getPoolAddressQuery.data.address && (
                    <Group position="apart">
                      <Text>Pool address</Text>
                      <Address address={getPoolAddressQuery.data.address} />
                    </Group>
                  )}

                  <Divider />

                  <Alert icon={<IconInfoCircle />}>
                    You've revoked the pool's delegation. You'll be able to pool
                    again when the locking period finishes.
                  </Alert>
                </Stack>
              </Stack>
            </>
          )}
        </Stack>
      </Card>
      <RevokeDelegationModal
        isStacking={isStacking}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStopPoolingClick={handleStopPoolingClick}
        isContractCallExtensionPageOpen={isContractCallExtensionPageOpen}
      />
    </>
  );
}
