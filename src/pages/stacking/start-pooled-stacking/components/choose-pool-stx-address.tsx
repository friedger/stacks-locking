import { ExternalLink } from '@components/external-link';

import { AddressField } from '../../components/fields/address-field';
import { Description, Step } from '../../components/stacking-form-step';

import { Stack, Text } from '@mantine/core';

export function ChoosePoolAddress() {
  return (
    <Step title="Pool address">
      <Stack>
        <Description>
          <Text>
            Enter the STX address of the pool with which you’d like to Stack without your STX
            leaving your wallet.
          </Text>
          <Text>
            The pool will provide this address for you. Pools can have different addresses that
            correspond to particular durations.
          </Text>
          <ExternalLink href="https://stacks.co/stacking#services">
            Discover pools on stacks.co
          </ExternalLink>
        </Description>
        <AddressField name="poolAddress" placeholder="Pool address" />
      </Stack>
    </Step>
  );
}
