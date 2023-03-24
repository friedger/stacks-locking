import { EXPLORER_URL, STACKING_CLUB_URL } from '@constants/app';
import urljoin from 'url-join';
import { isWebUri } from 'valid-url';

export async function openExternalLink(url: string) {
  if (!isWebUri(url)) return;
  return window.open(url);
}

const utmSource = 'utm_source=stacking-app';

// Explorer

function makeExplorerLink(path: string, network: string) {
  return urljoin(EXPLORER_URL, `${path}?${utmSource}&chain=${network}`);
}

export function makeExplorerTxLink(txId: string, network: string) {
  return makeExplorerLink(`/txid/${txId}`, network);
}

// export function makeExplorerAddressLink(address: string, network: string) {
//   return makeExplorerLink(`/address/${address}`, network);
// }

// Stacking Club

function makeStackingClubLink(path: string) {
  return urljoin(STACKING_CLUB_URL, `${path}?${utmSource}`);
}

export function makeStackingClubRewardAddressLink(address: string) {
  return makeStackingClubLink(`/reward-address/${address}`);
}
