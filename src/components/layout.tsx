import { Outlet } from 'react-router-dom';
import { Box, Flex } from '@stacks/ui';
import { Navbar } from './navbar';
import { Footer } from './footer';

export function Layout() {
  return (
    <>
      <Flex h="100vh" flexDirection="column">
        <Navbar />
        <Box>
          <Outlet />
        </Box>
        <Footer />
      </Flex>
    </>
  );
}
