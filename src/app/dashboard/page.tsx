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

  return (<>cdcdc</>)

  // return (
  //   <motion.div
  //     variants={containerVariants}
  //     initial="hidden"
  //     animate="visible"
  //     className="space-y-6"
  //   >
  //     <Box sx={{ mb: 4 }}>
  //       <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
  //         Dashboard
  //       </Typography>
  //       <Typography variant="body1" color="text.secondary">
  //         Welcome back, {user?.email?.split('@')[0] || 'User'}! Here&apos;s what&apos;s happening with your business today.
  //       </Typography>
  //     </Box>

  //     {/* Stats Cards */}
  //     <Grid container spacing={{ xs: 2, md: 3 }}>
  //       {sampleStats.map((stat, index) => (
  //         <Grid item xs={12} sm={6} md={3} key={index}>
  //           <motion.div variants={itemVariants}>
  //             <Card 
  //               sx={{ 
  //                 height: '100%',
  //                 boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  //                 borderRadius: 2,
  //                 overflow: 'visible',
  //                 position: 'relative',
  //                 transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  //                 '&:hover': {
  //                   transform: 'translateY(-4px)',
  //                   boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
  //                 }
  //               }}
  //             >
  //               <CardContent sx={{ p: { xs: 2, md: 3 }, pb: { xs: 2, md: 3 } }}>
  //                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
  //                   <Typography 
  //                     variant="subtitle2" 
  //                     color="text.secondary"
  //                     sx={{ 
  //                       fontSize: { xs: '0.75rem', md: '0.875rem' },
  //                       fontWeight: 500 
  //                     }}
  //                   >
  //                     {stat.title}
  //                   </Typography>
  //                   <Avatar 
  //                     sx={{ 
  //                       bgcolor: `${stat.color}15`, 
  //                       width: { xs: 32, md: 40 }, 
  //                       height: { xs: 32, md: 40 },
  //                       color: stat.color,
  //                       '& .MuiSvgIcon-root': {
  //                         fontSize: { xs: '1.1rem', md: '1.4rem' }
  //                       }
  //                     }}
  //                   >
  //                     {stat.icon}
  //                   </Avatar>
  //                 </Box>
  //                 <Typography 
  //                   variant="h4" 
  //                   component="div" 
  //                   sx={{ 
  //                     fontWeight: 700, 
  //                     mb: 1,
  //                     fontSize: { xs: '1.5rem', md: '2rem' }
  //                   }}
  //                 >
  //                   {stat.value}
  //                 </Typography>
  //                 <Typography 
  //                   variant="body2" 
  //                   sx={{ 
  //                     display: 'inline-flex', 
  //                     alignItems: 'center',
  //                     color: stat.isPositive ? 'success.main' : 'error.main',
  //                     fontWeight: 600,
  //                     fontSize: { xs: '0.7rem', md: '0.8rem' }
  //                   }}
  //                 >
  //                   {stat.isPositive ? <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} /> : <TrendingDown sx={{ fontSize: 16, mr: 0.5 }} />}
  //                   {stat.change}
  //                 </Typography>
  //               </CardContent>
  //             </Card>
  //           </motion.div>
  //         </Grid>
  //       ))}
  //     </Grid>

  //     {/* Charts Section */}
  //     <Grid container spacing={{ xs: 2, md: 3 }}>
  //       {/* Revenue Chart */}
  //       <Grid item xs={12} lg={8}>
  //         <motion.div variants={itemVariants}>
  //           <Card sx={{ 
  //             height: '100%', 
  //             boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  //             borderRadius: 2
  //           }}>
  //             <CardHeader
  //               title="Revenue Overview"
  //               titleTypographyProps={{ 
  //                 variant: 'h6', 
  //                 fontWeight: 600,
  //                 fontSize: { xs: '1rem', md: '1.1rem' } 
  //               }}
  //               action={
  //                 <IconButton>
  //                   <MoreVert />
  //                 </IconButton>
  //               }
  //               sx={{ 
  //                 pb: 0,
  //                 pt: { xs: 2, md: 2.5 },
  //                 px: { xs: 2, md: 3 } 
  //               }}
  //             />
  //             <CardContent sx={{ p: { xs: 1, md: 2 } }}>
  //               <Box sx={{ 
  //                 height: { xs: 240, md: 300 },
  //                 p: { xs: 1, md: 2 }
  //               }}>
  //                 <AnalyticsChart 
  //                   type="line"
  //                   data={revenueData}
  //                   title="Revenue Overview"
  //                 />
  //               </Box>
  //             </CardContent>
  //           </Card>
  //         </motion.div>
  //       </Grid>

  //       {/* Orders Chart */}
  //       <Grid item xs={12} sm={6} lg={4}>
  //         <motion.div variants={itemVariants}>
  //           <Card sx={{ 
  //             height: '100%', 
  //             boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  //             borderRadius: 2
  //           }}>
  //             <CardHeader
  //               title="Weekly Orders"
  //               titleTypographyProps={{ 
  //                 variant: 'h6', 
  //                 fontWeight: 600,
  //                 fontSize: { xs: '1rem', md: '1.1rem' } 
  //               }}
  //               action={
  //                 <IconButton>
  //                   <MoreVert />
  //                 </IconButton>
  //               }
  //               sx={{ 
  //                 pb: 0,
  //                 pt: { xs: 2, md: 2.5 },
  //                 px: { xs: 2, md: 3 } 
  //               }}
  //             />
  //             <CardContent sx={{ p: { xs: 1, md: 2 } }}>
  //               <Box sx={{ 
  //                 height: { xs: 200, md: 240 },
  //                 p: { xs: 1, md: 2 }
  //               }}>
  //                 <AnalyticsChart 
  //                   type="bar"
  //                   data={ordersData}
  //                   title="Weekly Orders"
  //                 />
  //               </Box>
  //             </CardContent>
  //           </Card>
  //         </motion.div>
  //       </Grid>

  //       {/* Recent Orders Table */}
  //       <Grid item xs={12} md={6} lg={4}>
  //         <motion.div variants={itemVariants}>
  //           <Card sx={{ 
  //             height: '100%', 
  //             boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  //             borderRadius: 2,
  //             display: 'flex',
  //             flexDirection: 'column'
  //           }}>
  //             <CardHeader
  //               title="Recent Orders"
  //               titleTypographyProps={{ 
  //                 variant: 'h6', 
  //                 fontWeight: 600,
  //                 fontSize: { xs: '1rem', md: '1.1rem' } 
  //               }}
  //               action={
  //                 <IconButton>
  //                   <MoreVert />
  //                 </IconButton>
  //               }
  //               sx={{ 
  //                 pb: 1,
  //                 pt: { xs: 2, md: 2.5 },
  //                 px: { xs: 2, md: 3 } 
  //               }}
  //             />
  //             <Divider />
  //             <List sx={{ 
  //               p: 0, 
  //               overflowY: 'auto',
  //               flexGrow: 1
  //             }}>
  //               {recentOrders.map((order, index) => (
  //                 <ListItem
  //                   key={order.id}
  //                   divider={index !== recentOrders.length - 1}
  //                   sx={{ 
  //                     px: { xs: 2, md: 3 },
  //                     py: { xs: 1, md: 1.5 } 
  //                   }}
  //                 >
  //                   <ListItemText
  //                     primary={
  //                       <Box sx={{ 
  //                         display: 'flex', 
  //                         justifyContent: 'space-between', 
  //                         alignItems: 'center',
  //                         flexWrap: { xs: 'wrap', sm: 'nowrap' }
  //                       }}>
  //                         <Typography 
  //                           variant="body2" 
  //                           fontWeight={600}
  //                           sx={{ mr: 1 }}
  //                         >
  //                           {order.id}
  //                         </Typography>
  //                         <Typography 
  //                           variant="body2"
  //                           sx={{ 
  //                             fontWeight: 500,
  //                             mr: { xs: 0, sm: 'auto' },
  //                             flexGrow: { xs: 1, sm: 0 },
  //                             order: { xs: 3, sm: 0 },
  //                             width: { xs: '100%', sm: 'auto' },
  //                             mt: { xs: 0.5, sm: 0 }
  //                           }}
  //                         >
  //                           {order.customer}
  //                         </Typography>
  //                         <Typography 
  //                           variant="body2" 
  //                           color="text.secondary"
  //                           sx={{ fontSize: '0.75rem' }}
  //                         >
  //                           {order.date}
  //                         </Typography>
  //                       </Box>
  //                     }
  //                     secondary={
  //                       <Box sx={{ 
  //                         display: 'flex', 
  //                         justifyContent: 'space-between',
  //                         alignItems: 'center',
  //                         mt: 0.5
  //                       }}>
  //                         <Typography 
  //                           variant="body2" 
  //                           fontWeight={600}
  //                           color="primary"
  //                         >
  //                           {order.amount}
  //                         </Typography>
  //                         <Box 
  //                           component="span"
  //                           sx={{ 
  //                             px: 1.5,
  //                             py: 0.5,
  //                             borderRadius: 1,
  //                             fontSize: '0.7rem',
  //                             fontWeight: 600,
  //                             bgcolor: order.status === 'Completed' 
  //                               ? 'success.light' 
  //                               : order.status === 'Processing'
  //                               ? 'info.light'
  //                               : 'warning.light',
  //                             color: order.status === 'Completed' 
  //                               ? 'success.dark' 
  //                               : order.status === 'Processing'
  //                               ? 'info.dark'
  //                               : 'warning.dark',
  //                           }}
  //                         >
  //                           {order.status}
  //                         </Box>
  //                       </Box>
  //                     }
  //                   />
  //                 </ListItem>
  //               ))}
  //             </List>
  //           </Card>
  //         </motion.div>
  //       </Grid>

  //       {/* Product Distribution Pie Chart */}
  //       <Grid item xs={12} md={6} lg={4}>
  //         <motion.div variants={itemVariants}>
  //           <Card sx={{ 
  //             height: '100%', 
  //             boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  //             borderRadius: 2
  //           }}>
  //             <CardHeader
  //               title="Product Distribution"
  //               titleTypographyProps={{ 
  //                 variant: 'h6', 
  //                 fontWeight: 600,
  //                 fontSize: { xs: '1rem', md: '1.1rem' } 
  //               }}
  //               action={
  //                 <IconButton>
  //                   <MoreVert />
  //                 </IconButton>
  //               }
  //               sx={{ 
  //                 pb: 0,
  //                 pt: { xs: 2, md: 2.5 },
  //                 px: { xs: 2, md: 3 } 
  //               }}
  //             />
  //             <CardContent sx={{ p: { xs: 1, md: 2 } }}>
  //               <Box sx={{ 
  //                 height: { xs: 200, md: 240 },
  //                 p: { xs: 1, md: 2 }
  //               }}>
  //                 <AnalyticsChart 
  //                   type="pie"
  //                   data={productDistribution}
  //                   title="Product Distribution"
  //                 />
  //               </Box>
  //             </CardContent>
  //           </Card>
  //         </motion.div>
  //       </Grid>

  //       {/* Inventory Status */}
  //       <Grid item xs={12} lg={4}>
  //         <motion.div variants={itemVariants}>
  //           <Card sx={{ 
  //             height: '100%', 
  //             boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  //             borderRadius: 2
  //           }}>
  //             <CardHeader
  //               title="Inventory Status"
  //               titleTypographyProps={{ 
  //                 variant: 'h6', 
  //                 fontWeight: 600,
  //                 fontSize: { xs: '1rem', md: '1.1rem' } 
  //               }}
  //               action={
  //                 <IconButton>
  //                   <MoreVert />
  //                 </IconButton>
  //               }
  //               sx={{ 
  //                 pb: 1,
  //                 pt: { xs: 2, md: 2.5 },
  //                 px: { xs: 2, md: 3 } 
  //               }}
  //             />
  //             <Divider />
  //             <CardContent sx={{ p: { xs: 2, md: 3 } }}>
  //               <Box sx={{ mb: 2 }}>
  //                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
  //                   <Typography variant="body2" fontWeight={500}>Electronics</Typography>
  //                   <Typography variant="body2" fontWeight={600}>85%</Typography>
  //                 </Box>
  //                 <LinearProgress 
  //                   variant="determinate" 
  //                   value={85} 
  //                   sx={{ 
  //                     height: 6, 
  //                     borderRadius: 1,
  //                     bgcolor: 'rgba(0,0,0,0.08)',
  //                     '& .MuiLinearProgress-bar': {
  //                       bgcolor: '#0ea5e9',
  //                       borderRadius: 1
  //                     }
  //                   }} 
  //                 />
  //               </Box>
                
  //               <Box sx={{ mb: 2 }}>
  //                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
  //                   <Typography variant="body2" fontWeight={500}>Clothing</Typography>
  //                   <Typography variant="body2" fontWeight={600}>65%</Typography>
  //                 </Box>
  //                 <LinearProgress 
  //                   variant="determinate" 
  //                   value={65} 
  //                   sx={{ 
  //                     height: 6, 
  //                     borderRadius: 1,
  //                     bgcolor: 'rgba(0,0,0,0.08)',
  //                     '& .MuiLinearProgress-bar': {
  //                       bgcolor: '#8b5cf6',
  //                       borderRadius: 1
  //                     }
  //                   }} 
  //                 />
  //               </Box>
                
  //               <Box sx={{ mb: 2 }}>
  //                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
  //                   <Typography variant="body2" fontWeight={500}>Home & Kitchen</Typography>
  //                   <Typography variant="body2" fontWeight={600}>40%</Typography>
  //                 </Box>
  //                 <LinearProgress 
  //                   variant="determinate" 
  //                   value={40} 
  //                   sx={{ 
  //                     height: 6, 
  //                     borderRadius: 1,
  //                     bgcolor: 'rgba(0,0,0,0.08)',
  //                     '& .MuiLinearProgress-bar': {
  //                       bgcolor: '#22c55e',
  //                       borderRadius: 1
  //                     }
  //                   }} 
  //                 />
  //               </Box>
                
  //               <Box>
  //                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
  //                   <Typography variant="body2" fontWeight={500}>Books</Typography>
  //                   <Typography variant="body2" fontWeight={600}>78%</Typography>
  //                 </Box>
  //                 <LinearProgress 
  //                   variant="determinate" 
  //                   value={78} 
  //                   sx={{ 
  //                     height: 6, 
  //                     borderRadius: 1,
  //                     bgcolor: 'rgba(0,0,0,0.08)',
  //                     '& .MuiLinearProgress-bar': {
  //                       bgcolor: '#f59e0b',
  //                       borderRadius: 1
  //                     }
  //                   }} 
  //                 />
  //               </Box>
  //             </CardContent>
  //           </Card>
  //         </motion.div>
  //       </Grid>
  //     </Grid>
  //   </motion.div>
  // );
} 