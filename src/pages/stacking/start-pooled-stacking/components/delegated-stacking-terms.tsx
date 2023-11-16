import { Stack, StackProps, Text } from '@stacks/ui';
import { IconLock } from '@tabler/icons-react';

import { Stacks } from '@components/icons/stacks';
import { StepsIcon } from '@components/icons/steps';
import { pseudoBorderLeft } from '@components/styles/pseudo-border-left';

import { StackingTermItem } from '../../components/stacking-term';

interface DelegatedStackingTermsProps extends StackProps {
  showPoxWrapperTermItem: boolean;
}
export function DelegatedStackingTerms({
  showPoxWrapperTermItem,
  ...rest
}: DelegatedStackingTermsProps) {
  return (
    <Stack
      textStyle={['body.small', 'body.large']}
      spacing="base-loose"
      pl="base"
      {...pseudoBorderLeft('feedback-alert')}
      {...rest}
    >
      <StackingTermItem
        title="This transaction can’t be reversed"
        icon={<IconLock width="16px" height="16px" />}
      >
        <Text>
          There will be no way to unlock your STX once the pool has started stacking them. You will
          need to wait until they unlock at the end of the pool&apos;s chosen number of cycles.
        </Text>
      </StackingTermItem>
      <StackingTermItem title="Research your pool" icon={<StepsIcon width="16px" height="16px" />}>
        <Text>
          Paying out rewards is at the discretion of the pool. Make sure you’ve researched and trust
          the pool you’re using.
        </Text>
      </StackingTermItem>
      {showPoxWrapperTermItem && (
        <StackingTermItem
          title="Stacking with Pool Contract"
          icon={<Stacks width="16px" height="16px" />}
        >
          <Text>
            The pool uses a smart contract that handles your stacking. By allowing the contract to
            call Stacking functions, you agree to the rules of the Pool contract.
          </Text>
        </StackingTermItem>
      )}
    </Stack>
  );
}
