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
  MenuItem
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useAuth } from '@/components/auth/AuthProvider';
import api from '@/lib/api';

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
  const [merchantId, setMerchantId] = useState<string>('');
  const [merchantName, setMerchantName] = useState<string>('');
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);
  const [confirmSuccess, setConfirmSuccess] = useState<boolean>(false);
  const theme = useTheme();
  
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
          
          // Set default merchant if available
          if (formattedMerchants.length > 0) {
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
  }, []);
  
  const handleMerchantChange = (event: SelectChangeEvent<unknown>) => {
    const selectedId = event.target.value as string;
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
      elevation={0}
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#fff',
        color: '#000',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        borderBottom: '1px solid #eaeaea'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', padding: '0 2rem', minHeight: '72px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ 
              display: 'flex', 
              fontWeight: 700,
              color: '#F07135',
              fontSize: '1.6rem',
              mr: 5,
              letterSpacing: '-0.5px',
            }}
          >
            CASHEERS
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <Chip 
              label="EVENT"
              size="small"
              sx={{ 
                mr: 1.5, 
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 600,
                borderRadius: '4px'
              }}
            />
            <FormControl variant="outlined" size="small">
              {loading ? (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  height: '48px', 
                  width: '300px',
                  justifyContent: 'center',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                }}>
                  <CircularProgress size={24} sx={{ color: '#F07135' }} />
                </Box>
              ) : (
                <Tooltip 
                  title={merchants.length === 0 ? "No events available" : "Select an event"} 
                  placement="bottom"
                  arrow
                >
                  <StyledSelect
                    value={merchantId}
                    onChange={handleMerchantChange}
                    IconComponent={KeyboardArrowDownIcon}
                    displayEmpty
                    renderValue={(selected) => {
                      const selectedMerchant = merchants.find(m => m.id === selected);
                      return (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <StorefrontIcon sx={{ color: '#F07135', mr: 1, fontSize: 20 }} />
                          <Typography sx={{ fontWeight: 500, color: '#333' }}>
                            {selectedMerchant ? selectedMerchant.name : "Select Event"}
                          </Typography>
                        </Box>
                      );
                    }}
                  >
                    {merchants.length === 0 ? (
                      <MenuItem value="" disabled>No events available</MenuItem>
                    ) : (
                      merchants.map((merchant) => (
                        <MenuItem 
                          key={merchant.id} 
                          value={merchant.id}
                          sx={{ 
                            padding: '10px 16px',
                            borderRadius: '4px',
                            margin: '2px 4px',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            },
                            '&.Mui-selected': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.12),
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.18),
                              }
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <StorefrontIcon sx={{ color: '#F07135', mr: 1, fontSize: 20, opacity: 0.8 }} />
                            <Typography>{merchant.name}</Typography>
                          </Box>
                        </MenuItem>
                      ))
                    )}
                  </StyledSelect>
                </Tooltip>
              )}
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <Tooltip 
            title={confirmSuccess ? "Confirmed successfully!" : "Confirm selected event"} 
            placement="bottom"
            arrow
          >
            <ConfirmButton 
              variant="contained"
              onClick={handleConfirm}
              disabled={loading || loadingConfirm || !merchantId}
              startIcon={confirmSuccess ? 
                <CheckCircleIcon sx={{ color: '#ffffff' }} /> : 
                null
              }
              sx={{ 
                mr: 3,
                bgcolor: confirmSuccess ? '#4CAF50' : '#F07135',
                '&:hover': { bgcolor: confirmSuccess ? '#3d8b40' : '#D5612C' },
              }}
            >
              {loadingConfirm ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : confirmSuccess ? (
                "Confirmed"
              ) : (
                "Confirm"
              )}
            </ConfirmButton>
          </Tooltip> */}

          <Tooltip 
            title="User profile" 
            placement="bottom-end"
            arrow
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              }
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mr: 1.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
                  {userName} Casheers
                </Typography>
                <Typography variant="caption" sx={{ color: alpha(theme.palette.text.primary, 0.6) }}>
                  {currentTime}
                </Typography>
              </Box>
              
              <Avatar 
                sx={{ 
                  width: 42, 
                  height: 42,
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  color: theme.palette.primary.main,
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  border: '2px solid #fff'
                }}
                alt={userData?.email || user?.email || 'User'}
              >
                {userData?.email?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </Box>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
} 