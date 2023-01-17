import { Box, CopyButton, Text } from '@mantine/core';
import { IconCopy } from '@tabler/icons';
import { truncateMiddle } from '@utils/tx-utils';

interface AddressArgs {
  address: string;
}
export function Address({ address }: AddressArgs) {
  return (
    <Text>
      {truncateMiddle(address)}{' '}
      <CopyButton value={address}>
        {({ copy }) => (
          <Box onClick={copy} display="inline" sx={{ cursor: 'pointer' }}>
            <IconCopy size={14} />
          </Box>
        )}
      </CopyButton>
    </Text>
  );
}
