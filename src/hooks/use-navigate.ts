import { NavigateOptions, To, useNavigate as useNavigateRouterDom } from 'react-router-dom';

import { useGlobalContext } from 'src/context/use-app-context';

import { setSearchForNetwork } from '@utils/networks';

/**
 * This navigation function delegates navigation with delta
 * to the standard implenentation.
 *
 * For "to" parameter of type string, it will fail if the string contains a "?".
 *
 * For "to" parameter of type Path, the search property
 * is overwritten with chain and api params.
 *
 * @returns a navigation function that sets the chain and api query parameters
 */
export function useNavigate() {
  const navigate = useNavigateRouterDom();
  const { activeNetwork } = useGlobalContext();
  return (to: To | number, options?: NavigateOptions) => {
    if (typeof to === 'number') {
      navigate(to);
    } else {
      const newTo = setSearchForNetwork(to, activeNetwork);
      navigate(newTo, options);
    }
  };
}
