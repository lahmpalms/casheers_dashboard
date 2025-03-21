"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Button,
  Tabs,
  Tab,
  useTheme,
  alpha,
  useMediaQuery,
  IconButton,
  Tooltip,
  FormControlLabel,
  Radio,
  RadioGroup,
  CircularProgress,
  TextField,
  MenuItem,
  Stack,
  Divider,
  Skeleton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Breadcrumbs,
  Slide,
  Fade
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format } from "date-fns";
import { motion } from "framer-motion";
import InsightsIcon from "@mui/icons-material/Insights";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CircleIcon from "@mui/icons-material/Circle";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TodayIcon from "@mui/icons-material/Today";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import api from "@/lib/api";
import React from "react";
import { useStore } from "@/store/useStore";

// Import components
import { StatCard } from "@/components/dashboard/registration/StatCard";
import { TicketDistributionChart } from "@/components/dashboard/registration/TicketDistributionChart";
import { DetailView } from "@/components/dashboard/registration/DetailView";

// Import types
import {
  RegistrationData,
  ChartData,
  HourlyTicketData,
  containerVariants,
  itemVariants,
  DetailedData,
  TicketTypeData,
} from "@/components/dashboard/registration/types";

export default function RegistrationPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeTimeTab, setActiveTimeTab] = useState<number>(0);
  const [activeAttendeeType, setActiveAttendeeType] = useState<string>("GA");
  const [registrationStats, setRegistrationStats] =
    useState<RegistrationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isChartLoading, setIsChartLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedToDate, setSelectedToDate] = useState<Date>(new Date());
  const [selectedDetailCard, setSelectedDetailCard] = useState<number | null>(null);
  const [showDetailView, setShowDetailView] = useState<boolean>(false);

  // Get merchantId from the global store
  const { merchantId } = useStore();

  // Fetch registration data from API
  useEffect(() => {
    // Use default merchant ID (228) if not set in store
    const currentMerchantId = merchantId;

    const fetchRegistrationData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get(
          `/dashboard/prereg-overall?merchant_id=${currentMerchantId}`
        );
        if (response.data) {
          setRegistrationStats({
            total_checkin: response.data.total_checkin || 0,
            pickup_wristband: response.data.pickup_wristband || 0,
            pre_registration: response.data.total || 0,
            door_sale: response.data.door_sale || 0,
          });
        } else {
          // No data in response - use sample data
          setRegistrationStats({
            total_checkin: 0,
            pickup_wristband: 0,
            pre_registration: 0,
            door_sale: 0,
          });
        }
      } catch (err) {
        console.error("Error fetching registration data:", err);
        setError("Failed to load registration data. Please try again later.");
        // Use fallback data for development
        setRegistrationStats({
          total_checkin: 0,
          pickup_wristband: 0,
          pre_registration: 0,
          door_sale: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrationData();
  }, [merchantId]);

  // Fetch chart data with date filters
  useEffect(() => {
    fetchChartData();
  }, [merchantId, selectedDate, selectedToDate, activeTimeTab]);

  // Function to fetch chart data
  const fetchChartData = async () => {
    setIsChartLoading(true);
    setChartError(null);

    // Calculate timestamps for API request
    const currentMerchantId = merchantId || "228";

    // Calculate from and to timestamps based on selected date and time
    const fromTimestamp = Math.floor(selectedDate.getTime() / 1000);

    // Calculate to timestamp based on active tab
    let toTimestamp = fromTimestamp;

    if (activeTimeTab === 0) {
      // 12 hours
      toTimestamp = fromTimestamp + 12 * 60 * 60;
    } else if (activeTimeTab === 1) {
      // 24 hours
      toTimestamp = fromTimestamp + 24 * 60 * 60;
    } else if (activeTimeTab === 2) {
      // Custom range
      toTimestamp = Math.floor(selectedToDate.getTime() / 1000);
    }

    try {
      const response = await api.get(
        `/dashboard/prereg-chart-data?merchant_id=${currentMerchantId}&checkin_from=${fromTimestamp}&checkin_to=${toTimestamp}`
      );

      if (response.data && response.data.success === 1) {
        setChartData(response.data.chart_data || { ticket_type_data: [] });
      } else {
        // Sample data for development/testing
        setChartData({
          ticket_type_data: [
            {
              ticket_type: "GA",
              count: 1500,
              checkin_at: fromTimestamp + 3600,
            },
            {
              ticket_type: "VIP",
              count: 350,
              checkin_at: fromTimestamp + 3600,
            },
            {
              ticket_type: "Premium VIP",
              count: 150,
              checkin_at: fromTimestamp + 7200,
            },
            { ticket_type: "GA", count: 800, checkin_at: fromTimestamp + 7200 },
            {
              ticket_type: "VIP",
              count: 250,
              checkin_at: fromTimestamp + 10800,
            },
          ],
        });
      }
    } catch (err) {
      console.error("Error fetching chart data:", err);
      setChartError("Failed to load chart data");

      // Fallback data with timestamps
      setChartData({
        ticket_type_data: [
          { ticket_type: "GA", count: 500, checkin_at: fromTimestamp + 3600 },
          { ticket_type: "VIP", count: 150, checkin_at: fromTimestamp + 3600 },
          {
            ticket_type: "Premium VIP",
            count: 50,
            checkin_at: fromTimestamp + 3600,
          },
          { ticket_type: "GA", count: 700, checkin_at: fromTimestamp + 7200 },
          { ticket_type: "VIP", count: 200, checkin_at: fromTimestamp + 7200 },
          {
            ticket_type: "Premium VIP",
            count: 100,
            checkin_at: fromTimestamp + 7200,
          },
        ],
      });
    } finally {
      setIsChartLoading(false);
    }
  };

  // Group ticket data by hours
  const groupTicketDataByHour = () => {
    if (
      !chartData ||
      !chartData.ticket_type_data ||
      chartData.ticket_type_data.length === 0
    ) {
      return [];
    }

    // Get unique ticket types
    const ticketTypes = Array.from(
      new Set(chartData.ticket_type_data.map((item) => item.ticket_type))
    );

    // Group data by hour
    const hourlyData: Record<string, HourlyTicketData> = {};

    chartData.ticket_type_data.forEach((item) => {
      if (!item.checkin_at) return;

      // Format hour from timestamp
      const date = new Date(item.checkin_at * 1000);
      const hour = date.getHours().toString().padStart(2, "0") + ":00";
      
      // Create a unique key that includes the date
      const dateHourKey = format(date, "yyyy-MM-dd") + "_" + hour;

      // Initialize hour data if doesn't exist
      if (!hourlyData[dateHourKey]) {
        hourlyData[dateHourKey] = {
          hour,
          date: new Date(item.checkin_at * 1000),
          timestamp: item.checkin_at,
          tickets: {},
          total: 0,
        };
        // Initialize all ticket types with 0
        ticketTypes.forEach((type) => {
          hourlyData[dateHourKey].tickets[type] = 0;
        });
      }

      // Add count to the specific ticket type for this hour
      if (hourlyData[dateHourKey].tickets[item.ticket_type] !== undefined) {
        hourlyData[dateHourKey].tickets[item.ticket_type] += item.count;
      } else {
        hourlyData[dateHourKey].tickets[item.ticket_type] = item.count;
      }

      // Add to hour total
      hourlyData[dateHourKey].total += item.count;
    });

    // Convert to array and sort by timestamp
    return Object.values(hourlyData).sort((a, b) => {
      return (a.timestamp || 0) - (b.timestamp || 0);
    });
  };

  // Update chart options when data changes
  useEffect(() => {
    if (chartData) {
      // No need to update chart options anymore since we're using AnalyticsChart
      // Just ensure data is available
    }
  }, [chartData]);

  // Format chart data for AnalyticsChart component
  const formatChartDataForAnalytics = () => {
    if (!chartData || !chartData.ticket_type_data || chartData.ticket_type_data.length === 0) {
      return null;
    }

    // Group data by hours
    const hourlyData = groupTicketDataByHour();
    
    // Format the hours to include date and time
    const formattedLabels = hourlyData.map((item) => {
      if (item.date) {
        return format(item.date, "MMM dd, HH:mm");
      }
      return item.hour; // Fallback to original hour format
    });

    // Get unique ticket types
    const ticketTypes = Array.from(
      new Set(chartData.ticket_type_data.map((item) => item.ticket_type))
    );

    // Create series for each ticket type
    const series = ticketTypes.map((ticketType, index) => {
      return {
        name: ticketType,
        data: hourlyData.map((hourData) => hourData.tickets[ticketType] || 0),
          color: getChartColor(index),
        stack: 'total'
      };
    });

    return {
      xAxis: formattedLabels,
      series: series
    };
  };

  const handleTimeTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setActiveTimeTab(newValue);
  };

  const handleAttendeeTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setActiveAttendeeType((event.target as HTMLInputElement).value);
  };

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setSelectedDate(newDate);
    }
  };

  const handleToDateChange = (newDate: Date | null) => {
    if (newDate) {
      setSelectedToDate(newDate);
    }
  };

  const formatDate = (date: Date): string => {
    return format(date, "dd MMM yyyy");
  };

  const formatTime = (date: Date): string => {
    return format(date, "HH:mm");
  };

  // Get color for chart based on index
  const getChartColor = (index: number) => {
    const colors = [
      "#F07135", // Primary
      alpha("#F07135", 0.7), // Lighter Primary
      alpha("#F07135", 0.4), // Even Lighter Primary
      "#FF9A7B",
      "#FFC7B2",
    ];
    return colors[index % colors.length];
  };

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
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  // Registration data for the cards (updated to use API data)
  const registrationData = registrationStats
    ? [
        {
          title: "Total Check-in",
          value: registrationStats.total_checkin.toLocaleString(),
          icon: <InsightsIcon />,
          color: "#F07135",
          disabled: false
        },
        {
          title: "Pick-up Wristband",
          value: registrationStats.pickup_wristband.toLocaleString(),
          icon: <InsightsIcon />,
          color: "#F07135",
          disabled: true
        },
        {
          title: "Pre-Registration",
          value: registrationStats.pre_registration.toLocaleString(),
          icon: <InsightsIcon />,
          color: "#F07135",
          disabled: false
        },
        {
          title: "Door Sale / Partner",
          value: registrationStats.door_sale.toLocaleString(),
          icon: <InsightsIcon />,
          color: "#F07135",
          disabled: true
        },
      ]
    : [];

  

  const handleDetailClick = (index: number) => {
    setSelectedDetailCard(index);
    setShowDetailView(true);
  };

  const handleCloseDetail = () => {
    setShowDetailView(false);
    // Only reset the selected card after animation completes
    setTimeout(() => {
      setSelectedDetailCard(null);
    }, 300);
  };

  // Sample detailed data for each card
  const getDetailedData = (index: number): DetailedData | null => {
    if (!registrationStats) return null;
    
    // Different data based on which card was clicked
    switch(index) {
      case 0: // Total Check-in
        return {
          title: "Total Check-in Details",
          summary: `${registrationStats.total_checkin.toLocaleString()} total attendees checked in`,
          chart: {
            xAxis: ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
            series: [
              {
                name: "Hourly Check-ins",
                data: [85, 125, 230, 350, 410, 320, 190, 140],
                color: "#F07135"
              }
            ]
          },
          stats: [
            { label: "Average check-in time", value: "2.5 minutes" },
            { label: "Peak check-in period", value: "13:00 - 14:00" },
            { label: "Check-in completion rate", value: "97%" }
          ]
        };
      
      case 1: // Pick-up Wristband
        return {
          title: "Wristband Pick-up Details",
          summary: `${registrationStats.pickup_wristband.toLocaleString()} attendees picked up wristbands`,
          chart: {
            xAxis: ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
            series: [
              {
                name: "Wristband Pick-ups",
                data: [55, 95, 190, 280, 360, 270, 160, 110],
                color: "#F07135"
              }
            ]
          },
          stats: [
            { label: "Average collection time", value: "1.8 minutes" },
            { label: "Peak collection period", value: "12:30 - 13:30" },
            { label: "Collection rate", value: "94%" }
          ]
        };
      
      case 2: // Pre-Registration
        return {
          title: "Pre-Registration Details",
          summary: `${registrationStats.pre_registration.toLocaleString()} pre-registered attendees`,
          chart: {
            xAxis: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            series: [
              {
                name: "Daily Pre-registrations",
                data: [120, 140, 190, 230, 290, 450, 520],
                color: "#F07135",
                showArea: true
              }
            ]
          },
          stats: [
            { label: "Conversion rate", value: "68%" },
            { label: "Most popular ticket type", value: "General Admission" },
            { label: "Average ticket value", value: "$42.50" }
          ]
        };
      
      case 3: // Door Sale
        return {
          title: "Door Sale / Partner Details",
          summary: `${registrationStats.door_sale.toLocaleString()} door sales and partner registrations`,
          chart: {
            name: "Distribution",
            items: [
              { value: 65, name: "Door Sales", itemStyle: { color: "#F07135" } },
              { value: 35, name: "Partner Registrations", itemStyle: { color: alpha("#F07135", 0.6) } }
            ]
          },
          stats: [
            { label: "Average transaction value", value: "$58.20" },
            { label: "Peak sales period", value: "14:00 - 16:00" },
            { label: "Payment method distribution", value: "Card: 84%, Cash: 16%" }
          ]
        };
      
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress sx={{ color: "#F07135" }} />
      </Box>
    );
  }

  if (error && !registrationStats) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{
            mt: 2,
            bgcolor: "#F07135",
            "&:hover": { bgcolor: "#D5612C" },
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-6"
    >
      {/* Main content section with sliding transition */}
      <motion.div
        initial={false}
        animate={{
          x: showDetailView ? "-100%" : 0,
          opacity: showDetailView ? 0 : 1,
          display: showDetailView ? "none" : "block",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          Registration
        </Typography>
      </Box>

      {/* Registration Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {registrationData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
                <StatCard
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                  index={index}
                  onDetailClick={() => handleDetailClick(index)}
                  disabled={stat.disabled}
                />
          </Grid>
        ))}
      </Grid>

          {/* Ticket Distribution Chart */}
          <TicketDistributionChart
            chartData={chartData}
            isChartLoading={isChartLoading}
            chartError={chartError}
            selectedDate={selectedDate}
            selectedToDate={selectedToDate}
            activeTimeTab={activeTimeTab}
            handleDateChange={handleDateChange}
            handleToDateChange={handleToDateChange}
            handleTimeTabChange={handleTimeTabChange}
            fetchChartData={fetchChartData}
            formatChartDataForAnalytics={formatChartDataForAnalytics}
            getChartColor={getChartColor}
                  />
                </Box>
      </motion.div>

      {/* Detail View */}
      <DetailView
        selectedDetailCard={selectedDetailCard}
        detailedData={selectedDetailCard !== null ? getDetailedData(selectedDetailCard) : null}
        onClose={handleCloseDetail}
        showDetailView={showDetailView}
      />
    </motion.div>
  );
}
