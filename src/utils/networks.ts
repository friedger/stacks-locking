import { To } from 'react-router-dom';

import { Network } from '../types/network';

export function createSearch(network: Network) {
  return `?chain=${network.mode}${network.isCustomNetwork ? `&api=${network.url}` : ''}`;
}

/**
 * Updates the link `to` with a search parameters for chain and api based on the provided network
 * @param to link to be updated
 * @param network network to use
 * @returns a new To object that has pathname and search properties
 */
export function setSearchForNetwork(to: To, network: Network): To {
  // if "to" is a string must not contain a search query
  // it is overwritten anyway
  const pathname = typeof to === 'string' ? to : to.pathname;
  return {
    pathname,
    search: createSearch(network),
  };
}
