import { ExternalLink } from '@components/external-link';
import { STACKING_ADDRESS_FORMAT_HELP_URL } from '@constants/app';
import { Tooltip, Text } from '@mantine/core';
import { forwardRef } from 'react';

const KeyText = forwardRef<HTMLDivElement, { children: string }>((props, ref) => (
  <Text
    ref={ref}
    display="inline"
    sx={{ cursor: 'help', textDecoration: 'underline', textDecorationStyle: 'dotted' }}
    {...props}
  ></Text>
));

export function ErrorPeriod1() {
  return (
    <>
      Please use a{' '}
      <Tooltip
        width={220}
        multiline
        withArrow
        label="Legacy, or P2PKH, Bitcoin addresses begin with the number 1"
      >
        <KeyText>Legacy</KeyText>
      </Tooltip>{' '}
      or{' '}
      <Tooltip
        width={220}
        multiline
        withArrow
        label="SegWit (Segregated Witness), or P2SH, Bitcoin addresses begin with the number 3"
      >
        <KeyText>SegWit</KeyText>
      </Tooltip>{' '}
      address.{' '}
      <Tooltip
        width={220}
        multiline
        withArrow
        label="Native SegWit addresses begin with the letters bc"
      >
        <KeyText>Native SegWit</KeyText>
      </Tooltip>{' '}
      addresses are not supported.{' '}
      <ExternalLink href={STACKING_ADDRESS_FORMAT_HELP_URL}>Learn more</ExternalLink>
    </>
  );
}

export function ErrorPostPeriod1() {
  return (
    <>
      Please use a{' '}
      <Tooltip inline label="Legacy, or P2PKH, Bitcoin addresses begin with the number 1">
        <KeyText>Legacy</KeyText>
      </Tooltip>
      ,{' '}
      <Tooltip label="SegWit (Segregated Witness), or P2SH, Bitcoin addresses begin with the number 3">
        <KeyText>SegWit</KeyText>
      </Tooltip>
      ,{' '}
      <Tooltip label='Native SegWit, or P2WPKH, Bitcoin addresses begin with "bc1q"'>
        <KeyText>Native SegWit</KeyText>
      </Tooltip>{' '}
      or{' '}
      <Tooltip label='Taproot, or P2TR, Bitcoin addresses begin with "bc1p"'>
        <KeyText>Taproot</KeyText>
      </Tooltip>{' '}
      address. <ExternalLink href={STACKING_ADDRESS_FORMAT_HELP_URL}>Learn more</ExternalLink>
    </>
  );
}
