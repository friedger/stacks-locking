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
      title="PoX Disabled During Cycle #58"
      isShowing={poxDisabled}
      icon={<IconAlertCircle />}
    >
      <Card p="loose">
        <Box mt={['tight', 'base', 'base', 'extra-loose']} mb="extra-loose">
          <ExplainerItem>
            There was an issue with stack-increase that caused an emergency.
          </ExplainerItem>
          <ExplainerItem>
            Do not interact with current stacking (pox-2) now. It is just a waste of transaction
            fees.
          </ExplainerItem>
          <ExplainerItem>
            During cycle #58 your STX are unlocked. Enjoy your liquid STX! Wait until the new
            stacking (pox-3) is live and available here. Estimated date: 10th May 2023.
          </ExplainerItem>
          <ExplainerItem>
            There will be no stacking rewards for #58 because disabling PoX means a switch to Proof
            of Burn. Rewards for cycle #57 are reduced due to the stack-increase issue. The stacked
            amount for each reward slot has been calculated incorrectly as 180k STX.
          </ExplainerItem>
          <ExplainerItem>
            There will be two upgrades from Stacks 2.1 to Stacks 2.2 at the end of cycle #57 and
            from Stacks 2.2 to Stacks 2.3 planned for the end of cycle #58. The details are
            described in the governance proposal 22. See{' '}
            <OpenExternalLinkInNewTab href="">SIP-22</OpenExternalLinkInNewTab>.
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
