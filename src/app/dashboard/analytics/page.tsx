'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  ButtonGroup,
  Divider,
  Paper,
  Tab,
  Tabs,
} from '@mui/material';
import { motion } from 'framer-motion';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';

// Mock data fetching function
const fetchAnalyticsData = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    salesByMonth: {
      xAxis: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      series: [
        {
          name: '2023',
          data: [3500, 4200, 5800, 7200, 6800, 8500, 9200, 10500, 9800, 11200, 12500, 13800],
          color: '#0ea5e9',
          showArea: true,
        },
        {
          name: '2022',
          data: [2500, 3200, 4800, 5200, 4800, 6500, 7200, 8500, 7800, 9200, 10500, 11800],
          color: '#8b5cf6',
          showArea: false,
        },
      ],
    },
    trafficSources: {
      name: 'Traffic Sources',
      items: [
        { value: 40, name: 'Direct', itemStyle: { color: '#0ea5e9' } },
        { value: 30, name: 'Organic Search', itemStyle: { color: '#8b5cf6' } },
        { value: 15, name: 'Referral', itemStyle: { color: '#22c55e' } },
        { value: 10, name: 'Social Media', itemStyle: { color: '#f59e0b' } },
        { value: 5, name: 'Other', itemStyle: { color: '#ef4444' } },
      ],
    },
    deviceDistribution: {
      name: 'Devices',
      items: [
        { value: 55, name: 'Mobile', itemStyle: { color: '#0ea5e9' } },
        { value: 35, name: 'Desktop', itemStyle: { color: '#8b5cf6' } },
        { value: 10, name: 'Tablet', itemStyle: { color: '#22c55e' } },
      ],
    },
    userActivity: {
      xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      series: [
        {
          name: 'Active Users',
          data: [1200, 1320, 1010, 1340, 900, 700, 850],
          color: '#0ea5e9',
        },
        {
          name: 'New Users',
          data: [200, 320, 210, 340, 190, 270, 350],
          color: '#8b5cf6',
        },
      ],
    },
    conversionRate: {
      xAxis: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      series: [
        {
          name: 'Conversion Rate',
          data: [2.1, 2.3, 2.5, 3.0, 3.2, 3.5, 3.7, 3.9, 4.0, 4.2, 4.5, 4.7],
          color: '#22c55e',
          showArea: true,
        },
      ],
    },
  };
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<string>('year');
  const [activeTab, setActiveTab] = useState<number>(0);
  
  const { data, isLoading } = useQuery({
    queryKey: ['analyticsData', timeRange],
    queryFn: fetchAnalyticsData,
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const { salesByMonth, trafficSources, deviceDistribution, userActivity, conversionRate } = data;

  // Animation variants
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

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-6"
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Detailed insights into your business performance.
        </Typography>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="analytics tabs">
          <Tab label="Overview" />
          <Tab label="Sales" />
          <Tab label="Users" />
          <Tab label="Traffic" />
        </Tabs>
        
        <ButtonGroup variant="outlined" size="small">
          <Button 
            onClick={() => handleTimeRangeChange('week')}
            variant={timeRange === 'week' ? 'contained' : 'outlined'}
          >
            Week
          </Button>
          <Button 
            onClick={() => handleTimeRangeChange('month')}
            variant={timeRange === 'month' ? 'contained' : 'outlined'}
          >
            Month
          </Button>
          <Button 
            onClick={() => handleTimeRangeChange('year')}
            variant={timeRange === 'year' ? 'contained' : 'outlined'}
          >
            Year
          </Button>
        </ButtonGroup>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <motion.div variants={itemVariants}>
            <AnalyticsChart 
              title="Sales Performance" 
              type="line" 
              data={salesByMonth} 
            />
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <motion.div variants={itemVariants}>
            <AnalyticsChart 
              title="Traffic Sources" 
              type="pie" 
              data={trafficSources} 
            />
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <motion.div variants={itemVariants}>
            <AnalyticsChart 
              title="Device Distribution" 
              type="pie" 
              data={deviceDistribution} 
            />
          </motion.div>
        </Grid>
        <Grid item xs={12} lg={8}>
          <motion.div variants={itemVariants}>
            <AnalyticsChart 
              title="User Activity" 
              type="bar" 
              data={userActivity} 
            />
          </motion.div>
        </Grid>
        <Grid item xs={12}>
          <motion.div variants={itemVariants}>
            <AnalyticsChart 
              title="Conversion Rate Trend" 
              type="line" 
              data={conversionRate} 
            />
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );
} 