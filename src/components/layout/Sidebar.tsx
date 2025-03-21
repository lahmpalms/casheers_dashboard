'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Box,
  useTheme as useMuiTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { useStore } from '@/store/useStore';
import { 
  Dashboard as DashboardIcon,
  AppRegistration as RegistrationIcon,
  ChatBubble as TopUpIcon,
  People as InEventIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { LinkBehavior } from '@/components/ui/LinkBehavior';

const menuItems = [
  { 
    text: 'Overview', 
    icon: <DashboardIcon />, 
    path: '/dashboard',
    exact: true
  },
  { 
    text: 'Registration', 
    icon: <RegistrationIcon />, 
    path: '/dashboard/registration',
    exact: true
  },
  { 
    text: 'Top-Up', 
    icon: <TopUpIcon />, 
    path: '/dashboard/topup',
    exact: true
  },
  { 
    text: 'In-Event Payment', 
    icon: <InEventIcon />, 
    path: '/dashboard/payment',
    exact: true
  },
  { 
    text: 'Setting', 
    icon: <SettingsIcon />, 
    path: '/dashboard/settings',
    exact: true
  },
  { 
    text: 'Log Out', 
    icon: <LogoutIcon />, 
    path: '/auth/logout',
    exact: true
  },
];

const drawerWidth = 260;

export function Sidebar() {
  const muiTheme = useMuiTheme();
  const pathname = usePathname();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const { sidebarOpen, setSidebarOpen } = useStore();
  
  // Close mobile drawer when route changes
  useEffect(() => {
    if (isMobile && mobileOpen) {
      setMobileOpen(false);
    }
  }, [pathname, isMobile]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarOpen && setSidebarOpen(!sidebarOpen);
    }
  };
  
  const isPathActive = (itemPath: string) => {
    return pathname === itemPath;
  };

  const drawer = (
    <Box sx={{ overflow: 'auto', mt: isMobile ? '0' : '64px' }}>
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text} 
            disablePadding
            sx={{ 
              display: 'block',
              borderLeft: isPathActive(item.path) ? '4px solid #F07135' : '4px solid transparent',
            }}
          >
            <ListItemButton
              component={LinkBehavior}
              to={item.path}
              sx={{
                minHeight: 48,
                px: 2.5,
                color: isPathActive(item.path) ? '#F07135' : 'inherit',
                '&:hover': {
                  backgroundColor: 'rgba(240, 113, 53, 0.04)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 2,
                  justifyContent: 'center',
                  color: isPathActive(item.path) ? '#F07135' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: isPathActive(item.path) ? 'bold' : 'regular',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ 
            position: 'fixed', 
            left: 16, 
            top: 12,
            zIndex: 1300,
            display: { xs: 'block', md: 'none' }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      
      {/* Mobile drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              width: drawerWidth,
              boxSizing: 'border-box',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        // Desktop permanent drawer
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              borderRight: '1px solid #eaeaea',
              backgroundColor: '#fff'
            },
          }}
          open={sidebarOpen}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
} 