import { Outlet } from 'react-router-dom';

import { Box, Flex } from '@stacks/ui';

import { Footer } from './footer';
import { Navbar } from './navbar';

export function Layout() {
  return (
    <>
      <Flex h="100vh" flexDirection="column">
        <Navbar />
        <Box flexGrow={1}>
          <Outlet />
        </Box>
        <Footer />
      </Flex>
    </>
  );
}
