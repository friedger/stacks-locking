import {
  InfoCardGroup as Group,
  InfoCard,
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardSection as Section,
  InfoCardValue as Value,
} from '@components/info-card';
import { Link } from '@components/link';
import { Box, color, Flex, FlexProps, Text } from '@stacks/ui';
import { IconEdit } from '@tabler/icons-react';

export function StackingGuideInfoCard(props: FlexProps) {
  return (
    <>
      <InfoCard {...props}>
        <Group width="100%">
          <Box position="relative" top="-3px">
            <Row>
              <IconEdit />

              <Link to="">
                <Text
                  textStyle="body.small"
                  fontWeight={500}
                  display="block"
                  style={{ wordBreak: 'break-all' }}
                >
                  Read the Stacking Guide
                </Text>
                <Text
                  textStyle="body.small"
                  color={color('text-caption')}
                  mt="tight"
                  display="inline-block"
                  lineHeight="18px"
                >
                  to get the most out of stacking.
                </Text>
              </Link>
            </Row>
          </Box>
        </Group>
      </InfoCard>
    </>
  );
}
