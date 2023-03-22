import { FC } from 'react';

interface PoolIconProps {
  src: string;
}
export const PoolIcon: FC<PoolIconProps> = ({ src }) => {
  return <img src={src} width="32px" alt="name" />;
};
