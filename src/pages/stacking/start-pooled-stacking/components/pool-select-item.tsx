import { Box, Flex, FlexProps, Text, color } from '@stacks/ui';
import { useFocus } from 'use-events';

import { OpenExternalLinkInNewTab } from '@components/external-link';
import { figmaTheme } from '@constants/figma-theme';

import { PoolName } from '../types-preset-pools';
import { CustomPoolAddressInput } from './custom-pool-address-input';

interface PoolSelectItemProps extends Omit<FlexProps, 'onChange'> {
  name: PoolName;
  description: string;
  url: string;
  icon: JSX.Element;
  activePoolName: PoolName;
  onChange(poolName: PoolName): void;
}

export function PoolSelectItem(props: PoolSelectItemProps) {
  const { name, description, url, icon, activePoolName, onChange, ...rest } = props;
  const [isFocused, bind] = useFocus();
  return (
    <Box
      borderRadius={isFocused ? '12px' : undefined}
      borderWidth="2px"
      borderColor={isFocused ? figmaTheme.borderFocused : '#00000000'}
      _hover={{ cursor: 'pointer' }}
      borderStyle="solid"
    >
      <Flex
        minHeight="72px"
        p="base-loose"
        as="label"
        border={`1px solid ${color('border')}`}
        borderRadius="12px"
        _hover={{ cursor: 'pointer' }}
        position="relative"
        {...rest}
      >
        <Flex width="100%">
          <Box position="relative" top="-3px">
            {icon}
          </Box>
          <Flex ml="base-loose" width="100%" flexDirection={['column', 'row']}>
            <Box>
              <Text
                textStyle="body.small"
                fontWeight={500}
                display="block"
                style={{ wordBreak: 'break-all' }}
              >
                {name}
              </Text>
              <Text
                textStyle="body.small"
                color={color('text-caption')}
                mt="tight"
                display="inline-block"
                lineHeight="18px"
              >
                {description}
              </Text>

              {name == PoolName.CustomPool ? (
                <CustomPoolAddressInput />
              ) : (
                url && (
                  <OpenExternalLinkInNewTab
                    href={url}
                    textStyle="body.small"
                    color={color('text-caption')}
                    mt="tight"
                    display="inline-block"
                    lineHeight="18px"
                  >
                    Learn more
                  </OpenExternalLinkInNewTab>
                )
              )}
            </Box>
          </Flex>
          <Flex ml="loose" alignItems="center">
            <input
              type="radio"
              id={name}
              name="poolName"
              value={name}
              checked={name === activePoolName}
              style={{ transform: 'scale(1.2)', outline: 0 }}
              onChange={e => onChange(e.target.value as PoolName)}
              {...bind}
            />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
