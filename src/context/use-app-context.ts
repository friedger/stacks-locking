import { useContext } from 'react';

import { GlobalContext } from './global-context';

export const useGlobalContext = () => {
  const globalContextProps = useContext(GlobalContext);

  return globalContextProps;
};
