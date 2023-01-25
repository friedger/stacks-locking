import { Box, Grid, MediaQuery, Stack } from '@mantine/core';

type Slots = 'intro' | 'stackingInfoPanel' | 'stackingForm';

type StartStackingLayoutProps = Record<Slots, JSX.Element>;

export function StartStackingLayout(props: StartStackingLayoutProps) {
  const { intro, stackingInfoPanel, stackingForm } = props;
  return (
    <Grid gutter="xl">
      <Grid.Col sm={12} md={6}>
        <Stack>
          {intro}

          <MediaQuery largerThan="md" styles={{ display: 'none' }}>
            <Box>{stackingInfoPanel}</Box>
          </MediaQuery>

          {stackingForm}
        </Stack>
      </Grid.Col>

      <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
        <Grid.Col md={6}>
          <Box sx={{ position: 'sticky', top: '20px' }}>{stackingInfoPanel}</Box>
        </Grid.Col>
      </MediaQuery>
    </Grid>
  );
}
