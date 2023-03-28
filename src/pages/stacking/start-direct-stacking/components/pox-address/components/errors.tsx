import { OpenExternalLinkInNewTab } from '@components/external-link';
import { ExplainerLabel } from '@components/tooltip';
import { STACKING_ADDRESS_FORMAT_HELP_URL } from '@constants/app';

export function ErrorPeriod1() {
  return (
    <>
      Please use a{' '}
      <ExplainerLabel text="Legacy, or P2PKH, Bitcoin addresses begin with the number 1">
        Legacy
      </ExplainerLabel>
      or{' '}
      <ExplainerLabel text="SegWit (Segregated Witness), or P2SH, Bitcoin addresses begin with the number 3">
        SegWit
      </ExplainerLabel>{' '}
      address.{' '}
      <ExplainerLabel text='Native SegWit, or P2WPKH, Bitcoin addresses begin with "bc1q"'>
        Native SegWit
      </ExplainerLabel>{' '}
      addresses are not supported.{' '}
      <OpenExternalLinkInNewTab href={STACKING_ADDRESS_FORMAT_HELP_URL}>
        Learn more
      </OpenExternalLinkInNewTab>
    </>
  );
}

export function ErrorPostPeriod1() {
  return (
    <>
      Please use a
      <ExplainerLabel text="Legacy, or P2PKH, Bitcoin addresses begin with the number 1">
        Legacy
      </ExplainerLabel>
      ,
      <ExplainerLabel text="SegWit (Segregated Witness), or P2SH, Bitcoin addresses begin with the number 3">
        SegWit
      </ExplainerLabel>
      ,
      <ExplainerLabel text='Native SegWit, or P2WPKH, Bitcoin addresses begin with "bc1q"'>
        Native SegWit
      </ExplainerLabel>
      or
      <ExplainerLabel text='Taproot, or P2TR, Bitcoin addresses begin with "bc1p"'>
        Taproot
      </ExplainerLabel>
      address.
      <OpenExternalLinkInNewTab
        href={STACKING_ADDRESS_FORMAT_HELP_URL}
        textDecoration="underline"
        display="inline-block"
        ml="extra-tight"
      >
        Learn more
      </OpenExternalLinkInNewTab>
    </>
  );
}
