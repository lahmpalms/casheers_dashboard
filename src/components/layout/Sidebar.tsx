'use client';

import { useState } from 'react';
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
} from '@mui/material';
import { useStore } from '@/store/useStore';
import { 
  Dashboard as DashboardIcon,
  AppRegistration as RegistrationIcon,
  ChatBubble as TopUpIcon,
  People as InEventIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
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
  
  const { sidebarOpen } = useStore();
  
  const isPathActive = (itemPath: string) => {
    return pathname === itemPath;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
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
      <Box sx={{ overflow: 'auto', mt: '64px' }}>
        <List>
          {menuItems.map((item, index) => (
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
    </Drawer>
  );
} 