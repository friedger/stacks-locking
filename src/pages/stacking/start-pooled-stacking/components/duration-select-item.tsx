import { ReactNode } from "react";

import { Box, Flex, Radio, Text } from "@mantine/core";

type DelegationTypes = "limited" | "indefinite";

interface DurationSelectItemProps {
  title: string;
  delegationType: DelegationTypes;
  activeDelegationType: DelegationTypes | null;
  onChange(duration: DelegationTypes): void;
  icon: JSX.Element;
  children: ReactNode;
}

export function DurationSelectItem(props: DurationSelectItemProps) {
  const {
    title,
    icon,
    delegationType,
    activeDelegationType,
    onChange,
    children,
  } = props;
  return (
    <Box
      sx={(theme) => ({
        minHeight: "72px",
        padding: theme.spacing.md,
        border: `1px solid ${
          delegationType === activeDelegationType
            ? theme.colors[theme.primaryColor][5]
            : theme.colors.gray[5]
        }`,
        borderRadius: theme.radius.lg,
        position: "relative",
      })}
      component="label"
      htmlFor={delegationType}
    >
      <Flex w="100%">
        <Box sx={{ position: "relative", top: "-3px" }}>{icon}</Box>
        <Flex pl="lg" w="100%" direction={{ xs: "column", md: "row" }}>
          <Box>
            <Text>{title}</Text>
            <Text>{children}</Text>
          </Box>
        </Flex>
        <Flex pl="lg" align="center">
          <Radio
            id={delegationType}
            name="delegationType"
            value={delegationType}
            checked={delegationType === activeDelegationType}
            onChange={(e) => onChange(e.target.value as DelegationTypes)}
          />
        </Flex>
      </Flex>
    </Box>
  );
}
