'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else if (!isLoading) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show a loading state while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  // This will only be shown briefly before the redirect happens
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          Casheers Dashboard
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          A modern, responsive, full-stack dashboard for your business
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => router.push('/auth/login')}
            sx={{ mr: 2 }}
          >
            Sign In
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => router.push('/auth/login')}
          >
            Learn More
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
