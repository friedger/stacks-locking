import { ReactNode } from "react";

import { Box, UnstyledButton } from "@mantine/core";

interface Props {
  onClick(e: React.MouseEvent<HTMLButtonElement>): void;
  children: ReactNode;
}
export function CircleButton({ onClick, children }: Props) {
  return (
    <UnstyledButton
      onClick={onClick}
      type="button"
      style={{ userSelect: "none" }}
      display="inline-block"
      w="28px"
      h="28px"
      sx={(t) => ({
        backgroundColor: t.colors.gray[2],
        borderRadius: t.radius.xl,
        fontWeight: 500,
        outline: 0,
        textAlign: "center",
        ":hover": {
          color: t.colors[t.primaryColor][5],
        },
      })}
      children={children}
    />
  );
}
