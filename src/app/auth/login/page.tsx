'use client';

import { Box, Container, Typography, useTheme, useMediaQuery } from '@mui/material';
import { LoginForm } from '@/components/auth/LoginForm';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LoginPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
          }}
        >
          {/* Left side - Branding and welcome message */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ 
              flex: isMobile ? '1 1 auto' : '1 1 50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: isMobile ? 'center' : 'flex-start',
              textAlign: isMobile ? 'center' : 'left',
              marginBottom: isMobile ? '2rem' : 0
            }}
          >
            <Typography
              variant={isMobile ? "h4" : "h3"}
              component="h1"
              gutterBottom
              sx={{ 
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 2
              }}
            >
              Casheers Dashboard
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ mb: 3, maxWidth: '500px' }}
            >
              Sign in to access your financial dashboard and manage your business operations
            </Typography>
            
            {!isMobile && (
              <Box sx={{ mt: 4, width: '80%', maxWidth: '450px' }}>
                <Image
                  src="/dashboard-preview.svg"
                  alt="Dashboard Preview"
                  width={500}
                  height={300}
                  style={{ 
                    width: '100%', 
                    height: 'auto',
                    borderRadius: '12px',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            )}
          </motion.div>

          {/* Right side - Login form */}
          <Box sx={{ flex: isMobile ? '1 1 auto' : '1 1 50%', display: 'flex', justifyContent: 'center' }}>
            <LoginForm />
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 