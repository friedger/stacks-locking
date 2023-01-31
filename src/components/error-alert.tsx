import { ReactNode } from "react";

import { IconAlertCircle } from "@tabler/icons-react";
import { Box } from "@stacks/ui";

interface Props {
  id?: string;
  children?: ReactNode;
}
export function ErrorAlert({ id, children }: Props) {
  return (
    <Box
      bg="red"
      icon={<IconAlertCircle size={16} />}
      title={`Error ${id ? id : ""}`}
      color="red"
    >
      {children}
    </Box>
  );
}
