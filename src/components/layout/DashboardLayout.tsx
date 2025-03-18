'use client';

import { ReactNode } from 'react';
import { Box, Container, Toolbar } from '@mui/material';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - 260px)` },
          // ml: { xs: 0, md: '260px' },
          mt: '64px',
        }}
      >
        <Container 
          maxWidth="xl" 
          sx={{ 
            py: 3,
            px: { xs: 3, md: 4 }
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
} 