import React, { FC } from "react";

import { Flex, Text, FlexProps, color } from "@stacks/ui";
import { UpdateArrowIcon } from "@components/icons/update-arrow";

interface UpdateAvailableButtonProps extends FlexProps {
  // windowState: WindowActiveState;
  windowState: any;
}

export const UpdateAvailableButton: FC<UpdateAvailableButtonProps> = (
  props
) => {
  const { windowState, ...rest } = props;
  return (
    <Flex alignItems="center" {...rest}>
      <UpdateArrowIcon
        color={windowState === "blurred" ? color("text-caption") : "blue"}
      />
      <Text
        textStyle="body.small.medium"
        ml="tight"
        color={windowState === "blurred" ? color("text-caption") : "blue"}
      >
        Update available
      </Text>
    </Flex>
  );
};
