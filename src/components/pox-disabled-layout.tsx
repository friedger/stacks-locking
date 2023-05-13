import { Box, BoxProps, Flex, Text, color } from '@stacks/ui';
import { IconAlertCircle } from '@tabler/icons-react';

import { useSIP22 } from '@hooks/use-sip-22';

import { Card } from './card';
import { BaseDrawer } from './drawer/base-drawer';
import { OpenExternalLinkInNewTab } from './external-link';

export function PoxDisabledLayout() {
  const { poxDisabled } = useSIP22();
  return (
    <BaseDrawer
      title="PoX Disabled During Cycle #59"
      isShowing={poxDisabled}
      icon={<IconAlertCircle />}
    >
      <Card p="loose">
        <Box mt={['tight', 'base', 'base', 'extra-loose']} mb="extra-loose">
          <ExplainerItem>
            There was an issue in the Stacking protocol&apos;s contract with the
            &quot;stack-increase&quot; function that has required an emergency network upgrade.
          </ExplainerItem>
          <ExplainerItem>
            Do not interact with current stacking (pox-2) now. It is just a waste of transaction
            fees.
          </ExplainerItem>
          <ExplainerItem>
            During cycle #58 and #59 your STX are unlocked. Enjoy your liquid STX! Wait until the
            new stacking (pox-3) is live and available here. Estimated date:{' '}
            <OpenExternalLinkInNewTab href="https://stacks-network.github.io/when-activation/2.4/">
              end of May 2023
            </OpenExternalLinkInNewTab>
            .
          </ExplainerItem>
          <ExplainerItem>
            There will be no stacking rewards for #58 and #59 because disabling PoX means a switch
            to Proof of Burn. Rewards for cycle #57 are reduced due to the stack-increase issue. The
            stacked amount for each reward slot has been calculated incorrectly as 180k STX.
          </ExplainerItem>
          <ExplainerItem>
            The Stacks blockchain has been upgraded to Stacks 2.3 and there will be another upgrade
            from Stacks 2.3 to Stacks 2.4 at the end of cycle #59. The details are described in the
            governance proposal 22. See{' '}
            <OpenExternalLinkInNewTab href="https://github.com/stacksgov/sips/blob/main/sips/sip-022/sip-022-emergency-pox-fix.md#enroll-beta">
              SIP-22
            </OpenExternalLinkInNewTab>
            .
          </ExplainerItem>
        </Box>
      </Card>
    </BaseDrawer>
  );
}

function ExplainerItem({ ...rest }: BoxProps) {
  return (
    <Flex alignItems="center" my="base">
      <Text display="block" textStyle="body.large.medium" color={color('text-body')} {...rest} />
    </Flex>
  );
}
