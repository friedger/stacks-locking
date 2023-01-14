import { Title as MantineTitle, TitleProps } from '@mantine/core';
export function Title(props: TitleProps) {
  return (
    <MantineTitle
      {...props}
      sx={{
        fontSize: '40px',
        lineHeight: '56px',
        display: 'block',
        fontWeight: 500,
      }}
    ></MantineTitle>
  );
}
