import { NavigateProps, Navigate as NavigateRouterDom } from 'react-router-dom';

import { useGlobalContext } from 'src/context/use-app-context';

import { setSearchForNetwork } from '@utils/networks';

export function Navigate({ to }: NavigateProps) {
  const { activeNetwork } = useGlobalContext();
  const newTo = setSearchForNetwork(to, activeNetwork);
  return <NavigateRouterDom to={newTo} />;
}
