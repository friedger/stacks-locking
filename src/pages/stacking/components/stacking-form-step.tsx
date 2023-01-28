import { ReactElement, ReactNode } from "react";

import { Box, Title } from "@mantine/core";
import { Button, ButtonProps, Container, Stack } from "@mantine/core";

interface StepProps {
  title: string;
  children?: ReactNode;
}

/**
 * A container for a single piece of information the user needs to provide.
 * Intended to contain a description and an input of some kind.
 *
 * ```tsx
 * function InfoUserNeedsToProvide() {
 *   return (
 *     <Step title="Some Info">
 *       <Description>
 *         <p>The user needs to provide this info</p>
 *       </Description>
 *       <input id="some-info" />
 *     </Step>
 *   );
 * }
 * ```
 */
export function Step(props: StepProps) {
  const { title, children, ...rest } = props;
  return (
    <Stack mt="extra-loose" {...rest}>
      <Title order={2}>{title}</Title>
      <Box>{children}</Box>
    </Stack>
  );
}

interface DescriptionProps {
  /**
   * Elements containig text descriptions. Uses `ReactElement` instead of
   * ReactNode since the internal `Stack` component used can't handle all
   * ReactNode types, such as string.
   */
  children: ReactElement | ReactElement[];
}
/**
 * A container around helpful information about the input the user is asked to
 * provide. May be of a longer form, and have several sentences or paragraphs.
 * Expects to have elements containing text as children.
 *
 * ```tsx
 * function InfoUserNeedsToProvide() {
 *   return (
 *     <Step title="Some Info">
 *       <Description>
 *         <p>The user should know about this before providing their info.</p>
 *         <p>This is also useful to the user.</p>
 *       </Description>
 *       <input id="some-info" />
 *     </Step>
 *   );
 * }
 * ```
 */
export function Description({ children }: DescriptionProps) {
  return <Stack>{children}</Stack>;
}

export function Action({ children, ...rest }: ButtonProps) {
  return (
    <Button size="md" mt="md" {...rest}>
      {children}
    </Button>
  );
}
