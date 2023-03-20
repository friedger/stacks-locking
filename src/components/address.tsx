import { Box, Text, useClipboard } from '@stacks/ui';
import { IconCopy } from '@tabler/icons-react';
import { truncateMiddle } from '@utils/tx-utils';

interface AddressArgs {
  address: string;
}
export function Address({ address }: AddressArgs) {
  const { onCopy } = useClipboard(address);
  return (
    <>
      <Text>{truncateMiddle(address)}</Text>&nbsp;
      <Box onClick={onCopy} display="inline-block" sx={{ cursor: 'pointer' }}>
        <IconCopy size={14} />
      </Box>
    </>
  );
}
