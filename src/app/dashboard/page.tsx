'use client';

import { useQuery } from '@tanstack/react-query';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  IconButton,
  LinearProgress,
  CardHeader
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { 
  TrendingUp, 
  TrendingDown, 
  AttachMoney, 
  People, 
  ShoppingCart, 
  Inventory,
  MoreVert
} from '@mui/icons-material';
import { useAuth } from '@/components/auth/AuthProvider';

// Mock data fetching function
const fetchDashboardData = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    statsData: {
      totalRevenue: 124500,
      totalOrders: 1543,
      totalCustomers: 892,
      conversionRate: 3.2,
    },
    revenueData: {
      xAxis: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      series: [
        {
          name: 'Revenue',
          data: [4500, 5200, 6800, 8200, 7800, 9500, 11200, 12500, 11800, 13200, 14500, 15800],
          color: '#0ea5e9',
          showArea: true,
        },
        {
          name: 'Expenses',
          data: [3200, 3800, 4200, 4800, 5100, 5600, 6200, 6800, 7200, 7800, 8200, 8800],
          color: '#8b5cf6',
          showArea: true,
        },
      ],
    },
    ordersData: {
      xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      series: [
        {
          name: 'Orders',
          data: [120, 132, 101, 134, 90, 70, 85],
          color: '#0ea5e9',
        },
      ],
    },
    productDistribution: {
      name: 'Products',
      items: [
        { value: 40, name: 'Electronics', itemStyle: { color: '#0ea5e9' } },
        { value: 25, name: 'Clothing', itemStyle: { color: '#8b5cf6' } },
        { value: 15, name: 'Home & Kitchen', itemStyle: { color: '#22c55e' } },
        { value: 10, name: 'Books', itemStyle: { color: '#f59e0b' } },
        { value: 10, name: 'Others', itemStyle: { color: '#ef4444' } },
      ],
    },
    recentOrders: [
      { id: '#ORD-001', customer: 'John Doe', date: '2023-05-15', amount: '$125.00', status: 'Completed' },
      { id: '#ORD-002', customer: 'Jane Smith', date: '2023-05-14', amount: '$245.50', status: 'Processing' },
      { id: '#ORD-003', customer: 'Robert Johnson', date: '2023-05-14', amount: '$78.25', status: 'Completed' },
      { id: '#ORD-004', customer: 'Emily Davis', date: '2023-05-13', amount: '$352.00', status: 'Pending' },
      { id: '#ORD-005', customer: 'Michael Brown', date: '2023-05-12', amount: '$95.75', status: 'Completed' },
    ],
  };
};

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  });

  const theme = useTheme();
  const { user } = useAuth();
  
  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const { statsData, revenueData, ordersData, productDistribution, recentOrders } = data;

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  // Sample data
  const sampleStats = [
    { 
      title: 'Total Revenue', 
      value: '$24,532', 
      change: '+12.5%', 
      isPositive: true,
      icon: <AttachMoney />,
      color: theme.palette.primary.main
    },
    { 
      title: 'Total Customers', 
      value: '1,245', 
      change: '+18.2%', 
      isPositive: true,
      icon: <People />,
      color: theme.palette.secondary.main
    },
    { 
      title: 'Total Orders', 
      value: '856', 
      change: '+5.7%', 
      isPositive: true,
      icon: <ShoppingCart />,
      color: theme.palette.success.main
    },
    { 
      title: 'Total Products', 
      value: '158', 
      change: '-2.3%', 
      isPositive: false,
      icon: <Inventory />,
      color: theme.palette.warning.main
    },
  ];

  const topProducts = [
    { name: 'Product A', sales: 245, progress: 85 },
    { name: 'Product B', sales: 190, progress: 65 },
    { name: 'Product C', sales: 140, progress: 48 },
    { name: 'Product D', sales: 120, progress: 41 },
    { name: 'Product E', sales: 90, progress: 31 },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-6"
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user?.email?.split('@')[0] || 'User'}! Here&apos;s what&apos;s happening with your business today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {sampleStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div variants={itemVariants}>
              <Card 
                elevation={0} 
                sx={{ 
                  borderRadius: 2,
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'border.DEFAULT',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {stat.title}
                      </Typography>
                      <Typography variant="h5" component="div" fontWeight={600}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Avatar 
                      sx={{ 
                        bgcolor: `${stat.color}15`, 
                        color: stat.color,
                        width: 48,
                        height: 48
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {stat.isPositive ? (
                      <TrendingUp fontSize="small" color="success" sx={{ mr: 0.5 }} />
                    ) : (
                      <TrendingDown fontSize="small" color="error" sx={{ mr: 0.5 }} />
                    )}
                    <Typography 
                      variant="body2" 
                      color={stat.isPositive ? 'success.main' : 'error.main'}
                      fontWeight={500}
                    >
                      {stat.change}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      vs last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <motion.div variants={itemVariants}>
            <AnalyticsChart 
              title="Revenue Overview" 
              type="line" 
              data={revenueData} 
            />
          </motion.div>
        </Grid>
        <Grid item xs={12} md={4}>
          <motion.div variants={itemVariants}>
            <AnalyticsChart 
              title="Product Distribution" 
              type="pie" 
              data={productDistribution} 
            />
          </motion.div>
        </Grid>
        <Grid item xs={12}>
          <motion.div variants={itemVariants}>
            <AnalyticsChart 
              title="Weekly Orders" 
              type="bar" 
              data={ordersData} 
            />
          </motion.div>
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <motion.div variants={itemVariants}>
        <Card elevation={0} className="border border-gray-200 dark:border-gray-800 rounded-xl">
          <CardHeader
            title="Recent Orders"
            action={
              <Button 
                variant="text" 
                size="small" 
                sx={{ fontWeight: 500 }}
              >
                View All
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <Box sx={{ overflow: 'auto' }}>
              <Box sx={{ minWidth: 600, p: 2 }}>
                <Box sx={{ display: 'flex', fontWeight: 600, py: 1.5, px: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Box sx={{ width: '20%' }}>Order ID</Box>
                  <Box sx={{ width: '25%' }}>Customer</Box>
                  <Box sx={{ width: '20%' }}>Date</Box>
                  <Box sx={{ width: '15%' }}>Amount</Box>
                  <Box sx={{ width: '20%' }}>Status</Box>
                </Box>
                {recentOrders.map((order, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      py: 2, 
                      px: 2, 
                      borderBottom: index !== recentOrders.length - 1 ? '1px solid' : 'none',
                      borderColor: 'border.DEFAULT',
                      '&:hover': {
                        bgcolor: 'background.default'
                      }
                    }}
                  >
                    <Box sx={{ width: '20%', color: 'primary.main', fontWeight: 500 }}>{order.id}</Box>
                    <Box sx={{ width: '25%' }}>{order.customer}</Box>
                    <Box sx={{ width: '20%', color: 'text.secondary' }}>{order.date}</Box>
                    <Box sx={{ width: '15%', fontWeight: 500 }}>{order.amount}</Box>
                    <Box sx={{ width: '20%' }}>
                      <Box 
                        component="span" 
                        sx={{ 
                          py: 0.5, 
                          px: 1.5, 
                          borderRadius: 1, 
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          bgcolor: order.status === 'Completed' 
                            ? 'success.light' 
                            : order.status === 'Processing' 
                              ? 'warning.light' 
                              : 'error.light',
                          color: order.status === 'Completed' 
                            ? 'success.main' 
                            : order.status === 'Processing' 
                              ? 'warning.main' 
                              : 'error.main',
                        }}
                      >
                        {order.status}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Products */}
      <Grid item xs={12} lg={4}>
        <motion.div variants={itemVariants}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'border.DEFAULT',
              height: '100%'
            }}
          >
            <CardHeader
              title="Top Products"
              action={
                <IconButton size="small">
                  <MoreVert fontSize="small" />
                </IconButton>
              }
            />
            <Divider />
            <CardContent>
              <List disablePadding>
                {topProducts.map((product, index) => (
                  <ListItem 
                    key={index} 
                    disablePadding 
                    sx={{ 
                      py: 1.5,
                      px: 0,
                      borderBottom: index !== topProducts.length - 1 ? '1px solid' : 'none',
                      borderColor: 'border.DEFAULT'
                    }}
                  >
                    <ListItemText
                      primary={product.name}
                      secondaryTypographyProps={{ component: 'div' }}
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                              {product.sales} sales
                            </Box>
                            <Box component="span" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                              {product.progress}%
                            </Box>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={product.progress} 
                            sx={{ 
                              height: 6, 
                              borderRadius: 1,
                              bgcolor: 'background.default',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: 'primary.main',
                              }
                            }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </motion.div>
      </Grid>
    </motion.div>
  );
} 