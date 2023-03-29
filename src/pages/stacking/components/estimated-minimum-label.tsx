import { Flex, FlexProps, Text, color } from '@stacks/ui';

import { StepsIcon } from '@components/icons/steps';
import { toHumanReadableStx } from '@utils/unit-convert';

interface EstimatedMinimumLabelProps extends FlexProps {
  /**
   * Extimated amount of uSTX needed to start stacking.
   */
  estimatedStackingMinimum: bigint;
}
export function EstimatedMinimumLabel({
  estimatedStackingMinimum,
  ...rest
}: EstimatedMinimumLabelProps) {
  return (
    <Flex {...rest}>
      <Flex
        width="44px"
        height="44px"
        background={color('bg-4')}
        borderRadius="50%"
        alignItems="center"
        justifyContent="center"
      >
        <StepsIcon size="14px" />
      </Flex>
      <Flex ml="base" flexDirection="column">
        <Text as="h4" display="block" textStyle="body.large.medium" lineHeight="20px">
          Estimated minimum
        </Text>
        <Text
          display="block"
          textStyle="body.large"
          color={color('text-caption')}
          lineHeight="20px"
          mt="extra-tight"
        >
          {toHumanReadableStx(estimatedStackingMinimum)}
        </Text>
      </Flex>
    </Flex>
  );
}
