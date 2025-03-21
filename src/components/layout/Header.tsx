'use client';

import { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Avatar, 
  Button,
  Select,
  FormControl,
  SelectChangeEvent,
  styled,
  CircularProgress,
  Tooltip,
  Fade,
  Chip,
  useTheme,
  InputBase,
  alpha,
  MenuItem,
  useMediaQuery,
  OutlinedInput
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '@/components/auth/AuthProvider';
import api from '@/lib/api';
import { useStore } from '@/store/useStore';
import React from 'react';

const StyledSelect = styled(Select)(({ theme }) => ({
  height: '48px',
  minWidth: '300px',
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  '& .MuiSelect-select': {
    paddingRight: '32px',
    display: 'flex',
    alignItems: 'center',
  }
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    borderRadius: 8,
    position: 'relative',
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
    border: '1px solid #ced4da',
    fontSize: 16,
    width: '100%',
    padding: '10px 12px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

// Create a custom input component to fix the notched issue
const CustomInput = React.forwardRef((props: { notched?: boolean } & React.ComponentProps<typeof StyledInputBase>, ref) => {
  // Filter out the notched property to prevent the warning
  const { notched, ...otherProps } = props;
  return <StyledInputBase ref={ref} {...otherProps} />;
});
CustomInput.displayName = 'CustomInput';

const ConfirmButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#F07135',
  color: 'white',
  fontWeight: 'bold',
  borderRadius: '8px',
  padding: '8px 24px',
  boxShadow: '0 2px 4px rgba(240, 113, 53, 0.3)',
  transition: 'all 0.2s ease',
  textTransform: 'none',
  fontSize: '0.95rem',
  height: '48px',
  '&:hover': {
    backgroundColor: '#D5612C',
    boxShadow: '0 4px 8px rgba(240, 113, 53, 0.4)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: '0 1px 2px rgba(240, 113, 53, 0.4)',
  }
}));

interface UserData {
  id: string;
  email: string;
  role: string;
}

interface Merchant {
  id: string;
  name: string;
}

export function Header() {
  const { user } = useAuth();
  const { merchantId: storeMerchantId, setMerchantId, setConfirmedMerchantId } = useStore();
  const [merchantId, setLocalMerchantId] = useState<string>('');
  const [merchantName, setMerchantName] = useState<string>('');
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);
  const [confirmSuccess, setConfirmSuccess] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Update local state when store changes
  useEffect(() => {
    if (storeMerchantId && storeMerchantId !== merchantId) {
      setLocalMerchantId(storeMerchantId);
    }
  }, [storeMerchantId, merchantId]);
  
  useEffect(() => {
    // Get user data from localStorage
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setUserData(userData);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
    
    // Set up Thailand time
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = { 
        timeZone: 'Asia/Bangkok',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };
      
      const thailandTime = new Date().toLocaleString('en-US', options);
      setCurrentTime(thailandTime);
    };
    
    updateTime();
    const intervalId = setInterval(updateTime, 60000); // Update every minute
    
    // Fetch merchants
    const fetchMerchants = async () => {
      setLoading(true);
      try {
        const response = await api.get('/dashboard/merchants');
        if (response.data.success === 1) {
          const merchantsData = response.data.merchants;
          const formattedMerchants = Object.entries(merchantsData).map(([id, name]) => ({
            id,
            name: name as string
          }));
          setMerchants(formattedMerchants);
          
          // Set default merchant if available and not already set
          if (formattedMerchants.length > 0 && !merchantId) {
            setLocalMerchantId(formattedMerchants[0].id);
            setMerchantId(formattedMerchants[0].id);
            setMerchantName(formattedMerchants[0].name);
          }
        }
      } catch (error) {
        console.error('Error fetching merchants:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMerchants();
    
    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleMerchantChange = (event: SelectChangeEvent<unknown>) => {
    const selectedId = event.target.value as string;
    setLocalMerchantId(selectedId);
    
    // Update the global store
    setMerchantId(selectedId);
    
    // Find merchant name from selected ID
    const selectedMerchant = merchants.find(m => m.id === selectedId);
    if (selectedMerchant) {
      setMerchantName(selectedMerchant.name);
    }
    
    // Reset confirmation state when event changes
    setConfirmSuccess(false);
  };
  
  const handleConfirm = () => {
    setLoadingConfirm(true);
    // Simulate API call
    setTimeout(() => {
      setLoadingConfirm(false);
      setConfirmSuccess(true);
      
      // Save the confirmed merchant ID to global store
      setConfirmedMerchantId(merchantId);
      
      // Reset success after 3 seconds
      setTimeout(() => setConfirmSuccess(false), 3000);
    }, 1000);
  };

  // Extract name from email (before @)
  const userName = userData?.email ? userData.email.split('@')[0].split('.').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join(' ') : 'User';

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'white',
        color: 'black',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '64px',
          px: { xs: 2, sm: 3 }
        }}
      >
        {/* Logo and Title - Hidden on mobile as we use hamburger menu there */}
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            ml: { xs: 5, md: 0 } // Add margin on mobile to account for hamburger button
          }}
        >
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 'bold',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Casheer Dashboard
          </Typography>
        </Box>

        {/* Main content of header */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            width: { xs: '100%', md: 'auto' },
            justifyContent: { xs: 'flex-end', md: 'space-between' },
            ml: { xs: 0, md: 4 }
          }}
        >
          {/* Merchant selector and confirm button */}
          <Box 
            sx={{ 
              display: isTablet ? 'none' : 'flex',
              alignItems: 'center',
              mr: { xs: 1, md: 4 },
              flexDirection: { xs: 'column', md: 'row' },
              width: { xs: '100%', md: 'auto' }
            }}
          >
            <FormControl sx={{ minWidth: { xs: '100%', md: 300 }, mb: { xs: 1, md: 0 } }}>
              <StyledSelect
                value={merchantId}
                onChange={handleMerchantChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Select Merchant' }}
                input={<CustomInput />}
                IconComponent={KeyboardArrowDownIcon}
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center', opacity: 0.7 }}>
                        <StorefrontIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography>Select a merchant</Typography>
                      </Box>
                    );
                  }
                  
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StorefrontIcon sx={{ mr: 1, fontSize: 20 }} />
                      <Typography>{merchantName || "Selected Merchant"}</Typography>
                    </Box>
                  );
                }}
              >
                {loading ? (
                  <MenuItem disabled>
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      <Typography>Loading merchants...</Typography>
                    </Box>
                  </MenuItem>
                ) : merchants.length === 0 ? (
                  <MenuItem disabled>
                    <Typography>No merchants available</Typography>
                  </MenuItem>
                ) : (
                  merchants.map((merchant) => (
                    <MenuItem 
                      key={merchant.id} 
                      value={merchant.id}
                      sx={{
                        py: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(240, 113, 53, 0.08)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(240, 113, 53, 0.12)',
                          '&:hover': {
                            backgroundColor: 'rgba(240, 113, 53, 0.18)',
                          }
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StorefrontIcon sx={{ mr: 1, fontSize: 20, color: '#F07135' }} />
                        <Typography>{merchant.name}</Typography>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </StyledSelect>
            </FormControl>
          </Box>
          
          {/* Time Display - Hidden on mobile */}
          <Typography 
            variant="body2" 
            sx={{ 
              mr: 4, 
              opacity: 0.8,
              display: { xs: 'none', lg: 'block' }
            }}
          >
            {currentTime}
          </Typography>
          
          {/* User Avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36,
                bgcolor: '#F07135',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {userData?.email ? userData.email.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            
            {/* User Email - Hidden on mobile */}
            <Box 
              sx={{ 
                ml: 2,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ fontWeight: 'medium', lineHeight: 1.2 }}
              >
                {userData?.email || 'User'}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ opacity: 0.6, lineHeight: 1.2 }}
              >
                {userData?.role || 'Role'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
} 