import { Link } from '@components/link';
import { figmaTheme } from '@constants/figma-theme';
import { Flex, Text } from '@stacks/ui';

export function Footer() {
  return (
    <Flex
      flexDirection="row"
      justifyContent="center"
      p="tight"
      borderTop={`1px solid ${figmaTheme.borderSubdued}`}
    >
      <Link to="https://www.hiro.so/terms" px="loose">
        <Text color={figmaTheme.text} fontWeight={500}>
          Terms of Use
        </Text>
      </Link>
    </Flex>
  );
}
