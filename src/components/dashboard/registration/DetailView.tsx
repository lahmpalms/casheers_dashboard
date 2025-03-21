import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Grid,
  Divider,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  alpha,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { motion } from "framer-motion";
import { DetailedData } from "./types";
import { useStore } from "@/store/useStore";
import api from "@/lib/api";

interface DetailViewProps {
  selectedDetailCard: number | null;
  detailedData: DetailedData | null;
  onClose: () => void;
  showDetailView: boolean;
}

// Define interfaces for chart data types
interface PieChartData {
  items: { 
    name: string; 
    value: number; 
    itemStyle?: { 
      color?: string;
    };
  }[];
  barChartOptions?: BarChartData;
  name?: string;
}

interface LineChartSeries {
  name: string;
  data: number[];
  color?: string;
  stack?: string;
  showArea?: boolean;
  itemStyle?: {
    color?: string | Function;
  };
}

interface LineChartData {
  series: LineChartSeries[];
  categories?: string[];
  xAxis?: string[];
  yAxis?: string[];
  totalCountries?: number;
  displayedCountries?: number;
}

interface DataCategoryItem {
  chartData: PieChartData | LineChartData;
  title: string;
}

interface DataCategories {
  ticketType: DataCategoryItem;
  gender: DataCategoryItem;
  age: DataCategoryItem;
  country: DataCategoryItem;
}

// Add BarChartData type for ticket type visualization
interface BarChartData {
  dataset: {
    source: (string | number)[][];
  };
  grid: { containLabel: boolean };
  xAxis: { name: string };
  yAxis: { type: string };
  visualMap: {
    orient: string;
    left: string;
    min: number;
    max: number;
    text: string[];
    dimension: number;
    inRange: {
      color: string[];
    }
  };
  series: {
    type: string;
    encode: {
      x: string;
      y: string;
    }
  }[];
}

interface CheckinDetailsResponse {
  success: number;
  total_data: number;
  checked_in: {
    ticket_type: string;
    count: number;
    checkin_at: number;
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    nfc_id: string | null;
  }[];
  gender: {
    male: number;
    female: number;
    other: number;
  };
  age_ranges: {
    range_20_24: number;
    range_25_34: number;
    range_35_44: number;
    range_45_54: number;
    range_55_plus: number;
  };
  countries: {
    country: string;
    count: number;
  }[];
  timestamp: number;
  sign: string;
}

// Add interface for Pre-Registration data
interface PreRegistrationResponse {
  success: number;
  total_data: number;
  registration_data: {
    ticket_type: string;
    count: number;
    firstname: string | null;
    lastname: string | null;
    phone: string;
    email: string | null;
    nfc_id: string | null;
  }[];
  gender: {
    male: number;
    female: number;
    other: number;
  };
  age_ranges: {
    range_20_24: number;
    range_25_34: number;
    range_35_44: number;
    range_45_54: number;
    range_55_plus: number;
  };
  countries: {
    country: string;
    count: number;
  }[];
  timestamp: number;
  sign: string;
}

interface TableDataItem {
  id: number;
  date: string;
  time: string;
  type: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
}

export const DetailView: React.FC<DetailViewProps> = ({
  selectedDetailCard,
  detailedData,
  onClose,
  showDetailView,
}) => {
  const theme = useTheme();
  const { merchantId } = useStore();
  const [fromDate, setFromDate] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // 7 days ago
  const [toDate, setToDate] = useState<Date>(new Date()); // Today
  const [activeDataCategory, setActiveDataCategory] = useState<string>("ticketType");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<CheckinDetailsResponse | null>(null);
  const [preRegData, setPreRegData] = useState<PreRegistrationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Remove mock data arrays and use empty default structure
  const defaultDataCategories: DataCategories = {
    ticketType: {
      chartData: {
        items: [],
        series: []
      },
      title: "Ticket Type Distribution",
    },
    gender: {
      chartData: {
        items: []
      },
      title: "Gender Distribution",
    },
    age: {
      chartData: {
        series: [{ name: "Attendees", data: [] }],
        categories: ["20-24", "25-34", "35-44", "45-54", "55+"],
      },
      title: "Age Distribution",
    },
    country: {
      chartData: {
        items: []
      },
      title: "Country Distribution",
    },
  };

  const [dataCategories, setDataCategories] = useState<DataCategories>(defaultDataCategories);

  useEffect(() => {
    // Fetch data when viewing details
    if (showDetailView && detailedData) {
      // Clear previous API data when changing detail view
      if (selectedDetailCard !== 0) {
        setApiData(null);
      }
      
      // For Total Check-in Details
      if (detailedData.title === "Total Check-in Details" && selectedDetailCard === 0) {
        fetchCheckinDetails();
      }
      
      // For Pre-Registration Details
      if (detailedData.title === "Pre-Registration Details" && selectedDetailCard === 2) {
        fetchPreRegistrationDetails();
      }
    }
  }, [showDetailView, fromDate, toDate, detailedData, selectedDetailCard, merchantId]);

  const fetchCheckinDetails = async () => {
    setIsLoading(true);
    setError(null);
    
    const checkinFrom = Math.floor(fromDate.getTime() / 1000);
    const checkinTo = Math.floor(toDate.getTime() / 1000);
    const currentMerchantId = merchantId || "228";
    
    try {
      const response = await api.get<CheckinDetailsResponse>(
        `/dashboard/prereg-checkin-details?merchant_id=${currentMerchantId}&checkin_from=${checkinFrom}&checkin_to=${checkinTo}`
      );
      
      const responseData = response.data;
      
      if (responseData && responseData.success === 1) {
        setApiData(responseData);
        
        // Update data categories with API data
        const newDataCategories = { ...defaultDataCategories };
        
        // Update ticket type distribution
        if (responseData.checked_in && responseData.checked_in.length > 0) {
          // Summarize ticket types before visualization
          const ticketTypeMap = new Map<string, number>();
          
          responseData.checked_in.forEach(item => {
            const currentCount = ticketTypeMap.get(item.ticket_type) || 0;
            ticketTypeMap.set(item.ticket_type, currentCount + item.count);
          });
          
          // Convert to array and sort by count (descending)
          const sortedTicketTypes = Array.from(ticketTypeMap.entries())
            .sort((a, b) => b[1] - a[1]);
          
          // Convert to format needed for bar chart
          const barLabels: string[] = [];
          const barData: number[] = [];
          
          sortedTicketTypes.forEach(([type, count]) => {
            barLabels.push(type);
            barData.push(count);
          });
          
          // Format data for horizontal bar chart
          newDataCategories.ticketType.chartData = {
            items: sortedTicketTypes.map(([name, value]) => ({ name, value })),
            // Swap X and Y axis for horizontal bar chart orientation
            yAxis: barLabels, // Categories (ticket types) go on y-axis for horizontal bars
            xAxis: undefined, // Don't set xAxis here to avoid type conflicts
            series: [{
              name: 'Check-ins',
              data: barData,
              color: '#F07135'
            }]
          };
        }
        
        // Update gender distribution
        if (responseData.gender) {
          const genderData = responseData.gender;
          // Enhanced gender visualization with:
          // 1. Blue color for Male (matching conventional color)
          // 2. Pink color for Female (matching conventional color)
          // 3. Purple color for Other (neutral and distinctive)
          // 4. Added name property for better tooltip labels
          newDataCategories.gender.chartData = {
            items: [
              { name: "Male", value: genderData.male, itemStyle: { color: '#3B82F6' } },
              { name: "Female", value: genderData.female, itemStyle: { color: '#EC4899' } },
              { name: "Other", value: genderData.other, itemStyle: { color: '#8B5CF6' } }
            ],
            name: "Gender Distribution"
          };
        }
        
        // Update age distribution
        if (responseData.age_ranges) {
          const ageData = responseData.age_ranges;
          
          // Prepare age data for horizontal bar chart
          const ageLabels = ["20-24", "25-34", "35-44", "45-54", "55+"];
          const ageValues = [
            ageData.range_20_24,
            ageData.range_25_34,
            ageData.range_35_44,
            ageData.range_45_54,
            ageData.range_55_plus
          ];
          
          // Create color gradient for age ranges (lighter to darker purple)
          const ageColors = ['#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9'];
          
          newDataCategories.age.chartData = {
            // For horizontal bar chart, similar to ticket type
            yAxis: ageLabels,
            xAxis: undefined,
            // Single series with color array for the gradient
            series: [{
              name: "Attendees",
              data: ageValues,
              itemStyle: {
                color: function(params: any) {
                  // Return the appropriate color from our gradient array
                  return ageColors[params.dataIndex];
                }
              }
            }],
            // Keep items for table data
            items: [
              { name: "20-24", value: ageData.range_20_24, itemStyle: { color: ageColors[0] } },
              { name: "25-34", value: ageData.range_25_34, itemStyle: { color: ageColors[1] } },
              { name: "35-44", value: ageData.range_35_44, itemStyle: { color: ageColors[2] } },
              { name: "45-54", value: ageData.range_45_54, itemStyle: { color: ageColors[3] } },
              { name: "55+", value: ageData.range_55_plus, itemStyle: { color: ageColors[4] } }
            ]
          };
        }
        
        // Update country distribution
        if (responseData.countries && responseData.countries.length > 0) {
          // Sort countries by count (descending)
          const sortedCountries = [...responseData.countries].sort((a, b) => b.count - a.count);
          
          // Limit to top 10 countries for better visualization
          const MAX_COUNTRIES = 10;
          const limitedCountries = sortedCountries.slice(0, MAX_COUNTRIES);
          
          // Convert to format needed for bar chart
          const countryLabels: string[] = [];
          const countryData: number[] = [];
          
          limitedCountries.forEach(item => {
            countryLabels.push(item.country);
            countryData.push(item.count);
          });
          
          // Format data for horizontal bar chart
          newDataCategories.country.chartData = {
            items: sortedCountries.map(item => ({
              name: item.country,
              value: item.count
            })),
            // Swap X and Y axis for horizontal bar chart orientation
            yAxis: countryLabels, // Countries go on y-axis for horizontal bars
            xAxis: undefined,
            series: [{
              name: 'Attendees',
              data: countryData,
              color: '#10B981' // Green color for country data
            }],
            // Add metadata about the total count and displayed count
            totalCountries: sortedCountries.length,
            displayedCountries: limitedCountries.length
          };
        }
        
        setDataCategories(newDataCategories);
      } else {
        setError("Failed to load check-in details");
      }
    } catch (err) {
      console.error("Error fetching check-in details:", err);
      setError("Failed to load check-in details. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add function to fetch pre-registration details
  const fetchPreRegistrationDetails = async () => {
    setIsLoading(true);
    setError(null);
    
    const currentMerchantId = merchantId || "228";
    
    try {
      const response = await api.get<PreRegistrationResponse>(
        `/dashboard/prereg-overall-detail?merchant_id=${currentMerchantId}`
      );
      
      const responseData = response.data;
      
      if (responseData && responseData.success === 1) {
        setPreRegData(responseData);
        
        // Update data categories with API data
        const newDataCategories = { ...defaultDataCategories };
        
        // Update ticket type distribution
        if (responseData.registration_data && responseData.registration_data.length > 0) {
          // Summarize ticket types before visualization
          const ticketTypeMap = new Map<string, number>();
          
          responseData.registration_data.forEach(item => {
            const currentCount = ticketTypeMap.get(item.ticket_type) || 0;
            ticketTypeMap.set(item.ticket_type, currentCount + item.count);
          });
          
          // Convert to array and sort by count (descending)
          const sortedTicketTypes = Array.from(ticketTypeMap.entries())
            .sort((a, b) => b[1] - a[1]);
          
          // Convert to format needed for bar chart
          const barLabels: string[] = [];
          const barData: number[] = [];
          
          sortedTicketTypes.forEach(([type, count]) => {
            barLabels.push(type);
            barData.push(count);
          });
          
          // Format data for horizontal bar chart
          newDataCategories.ticketType.chartData = {
            items: sortedTicketTypes.map(([name, value]) => ({ name, value })),
            // Swap X and Y axis for horizontal bar chart orientation
            yAxis: barLabels, // Categories (ticket types) go on y-axis for horizontal bars
            xAxis: undefined, // Don't set xAxis here to avoid type conflicts
            series: [{
              name: 'Registrations',
              data: barData,
              color: '#F07135'
            }]
          };
        }
        
        // Update gender distribution
        if (responseData.gender) {
          const genderData = responseData.gender;
          // Enhanced gender visualization with:
          // 1. Blue color for Male (matching conventional color)
          // 2. Pink color for Female (matching conventional color)
          // 3. Purple color for Other (neutral and distinctive)
          // 4. Added name property for better tooltip labels
          newDataCategories.gender.chartData = {
            items: [
              { name: "Male", value: genderData.male, itemStyle: { color: '#3B82F6' } },
              { name: "Female", value: genderData.female, itemStyle: { color: '#EC4899' } },
              { name: "Other", value: genderData.other, itemStyle: { color: '#8B5CF6' } }
            ],
            name: "Gender Distribution"
          };
        }
        
        // Update age distribution
        if (responseData.age_ranges) {
          const ageData = responseData.age_ranges;
          
          // Prepare age data for horizontal bar chart
          const ageLabels = ["20-24", "25-34", "35-44", "45-54", "55+"];
          const ageValues = [
            ageData.range_20_24,
            ageData.range_25_34,
            ageData.range_35_44,
            ageData.range_45_54,
            ageData.range_55_plus
          ];
          
          // Create color gradient for age ranges (lighter to darker purple)
          const ageColors = ['#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9'];
          
          newDataCategories.age.chartData = {
            // For horizontal bar chart, similar to ticket type
            yAxis: ageLabels,
            xAxis: undefined,
            // Single series with color array for the gradient
            series: [{
              name: "Registrants",
              data: ageValues,
              itemStyle: {
                color: function(params: any) {
                  // Return the appropriate color from our gradient array
                  return ageColors[params.dataIndex];
                }
              }
            }],
            // Keep items for table data
            items: [
              { name: "20-24", value: ageData.range_20_24, itemStyle: { color: ageColors[0] } },
              { name: "25-34", value: ageData.range_25_34, itemStyle: { color: ageColors[1] } },
              { name: "35-44", value: ageData.range_35_44, itemStyle: { color: ageColors[2] } },
              { name: "45-54", value: ageData.range_45_54, itemStyle: { color: ageColors[3] } },
              { name: "55+", value: ageData.range_55_plus, itemStyle: { color: ageColors[4] } }
            ]
          };
        }
        
        // Update country distribution
        if (responseData.countries && responseData.countries.length > 0) {
          // Sort countries by count (descending)
          const sortedCountries = [...responseData.countries].sort((a, b) => b.count - a.count);
          
          // Limit to top 10 countries for better visualization
          const MAX_COUNTRIES = 10;
          const limitedCountries = sortedCountries.slice(0, MAX_COUNTRIES);
          
          // Convert to format needed for bar chart
          const countryLabels: string[] = [];
          const countryData: number[] = [];
          
          limitedCountries.forEach(item => {
            countryLabels.push(item.country);
            countryData.push(item.count);
          });
          
          // Format data for horizontal bar chart
          newDataCategories.country.chartData = {
            items: sortedCountries.map(item => ({
              name: item.country,
              value: item.count
            })),
            // Swap X and Y axis for horizontal bar chart orientation
            yAxis: countryLabels, // Countries go on y-axis for horizontal bars
            xAxis: undefined,
            series: [{
              name: 'Registrants',
              data: countryData,
              color: '#10B981' // Green color for country data
            }],
            // Add metadata about the total count and displayed count
            totalCountries: sortedCountries.length,
            displayedCountries: limitedCountries.length
          };
        }
        
        setDataCategories(newDataCategories);
      } else {
        setError("Failed to load pre-registration details");
      }
    } catch (err) {
      console.error("Error fetching pre-registration details:", err);
      setError("Failed to load pre-registration details. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!detailedData) return null;

  const handleFromDateChange = (newDate: Date | null) => {
    if (newDate) {
      setFromDate(newDate);
    }
  };

  const handleToDateChange = (newDate: Date | null) => {
    if (newDate) {
      setToDate(newDate);
    }
  };

  const handleCategoryChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveDataCategory(newValue);
  };

  const activeData = dataCategories[activeDataCategory as keyof typeof dataCategories];

  // Fix the chart type check
  const isLineChart = (data: PieChartData | LineChartData): data is LineChartData => {
    return 'series' in data;
  };

  // Function to format timestamp to date
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  // Function to format timestamp to time
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get table data exclusively from API
  const getTableData = (): TableDataItem[] => {
    // For Total Check-in details
    if (apiData && selectedDetailCard === 0 && detailedData?.title === "Total Check-in Details") {
      try {
        // For Ticket Type tab - show type and count summary
        if (activeDataCategory === "ticketType" && apiData.checked_in && apiData.checked_in.length > 0) {
          // Summarize ticket types before displaying
          const ticketTypeMap = new Map<string, number>();
          
          apiData.checked_in.forEach(item => {
            const currentCount = ticketTypeMap.get(item.ticket_type) || 0;
            ticketTypeMap.set(item.ticket_type, currentCount + item.count);
          });
          
          // Convert to array and sort by count (descending)
          const sortedTicketTypes = Array.from(ticketTypeMap.entries())
            .sort((a, b) => b[1] - a[1]);
          
          // Format for table display
          const tableData = sortedTicketTypes.map(([type, count], index) => ({
            id: index,
            date: "-",
            time: "-",
            type: type,
            name: `${count} attendees`,
            status: "Checked In"
          }));
          
          return tableData;
        }
        
        // For Gender tab - create gender-based table data
        if (activeDataCategory === "gender" && apiData.gender) {
          // Convert gender data to table format
          const genderData = [
            {
              id: 1,
              date: "-",
              time: "-",
              type: "Male",
              name: `${apiData.gender.male} attendees`,
              status: "Verified"
            },
            {
              id: 2,
              date: "-", 
              time: "-",
              type: "Female",
              name: `${apiData.gender.female} attendees`,
              status: "Verified"
            },
            {
              id: 3,
              date: "-",
              time: "-",
              type: "Other",
              name: `${apiData.gender.other} attendees`,
              status: "Verified"
            }
          ];
          
          return genderData;
        }
        
        // For Age tab - create age-based table data
        if (activeDataCategory === "age" && apiData.age_ranges) {
          // Convert age data to table format
          const ageData = [
            {
              id: 1,
              date: "-",
              time: "-",
              type: "20-24",
              name: `${apiData.age_ranges.range_20_24} attendees`,
              status: "Verified"
            },
            {
              id: 2,
              date: "-", 
              time: "-",
              type: "25-34",
              name: `${apiData.age_ranges.range_25_34} attendees`,
              status: "Verified"
            },
            {
              id: 3,
              date: "-",
              time: "-",
              type: "35-44",
              name: `${apiData.age_ranges.range_35_44} attendees`,
              status: "Verified"
            },
            {
              id: 4,
              date: "-",
              time: "-",
              type: "45-54",
              name: `${apiData.age_ranges.range_45_54} attendees`,
              status: "Verified"
            },
            {
              id: 5,
              date: "-",
              time: "-",
              type: "55+",
              name: `${apiData.age_ranges.range_55_plus} attendees`,
              status: "Verified"
            }
          ];
          
          return ageData;
        }
        
        // For Country tab - create country-based table data
        if (activeDataCategory === "country" && apiData.countries && apiData.countries.length > 0) {
          // Sort countries by count (descending)
          const sortedCountries = [...apiData.countries].sort((a, b) => b.count - a.count);
          
          // Convert to table format
          const countryData = sortedCountries.map((item, index) => ({
            id: index + 1,
            date: "-",
            time: "-",
            type: item.country,
            name: `${item.count} attendees`,
            status: "Verified"
          }));
          
          return countryData;
        }
      } catch (error) {
        console.error("Error generating table data:", error);
      }
    }
    
    // For Pre-Registration details
    if (preRegData && selectedDetailCard === 2 && detailedData?.title === "Pre-Registration Details") {
      try {
        // For Ticket Type tab - show type and count summary
        if (activeDataCategory === "ticketType" && preRegData.registration_data && preRegData.registration_data.length > 0) {
          // Summarize ticket types before displaying
          const ticketTypeMap = new Map<string, number>();
          
          preRegData.registration_data.forEach(item => {
            const currentCount = ticketTypeMap.get(item.ticket_type) || 0;
            ticketTypeMap.set(item.ticket_type, currentCount + item.count);
          });
          
          // Convert to array and sort by count (descending)
          const sortedTicketTypes = Array.from(ticketTypeMap.entries())
            .sort((a, b) => b[1] - a[1]);
          
          // Format for table display
          const tableData = sortedTicketTypes.map(([type, count], index) => ({
            id: index,
            date: "-",
            time: "-",
            type: type,
            name: `${count} registrants`,
            status: "Registered"
          }));
          
          return tableData;
        }
        
        // For Gender tab - create gender-based table data
        if (activeDataCategory === "gender" && preRegData.gender) {
          // Convert gender data to table format
          const genderData = [
            {
              id: 1,
              date: "-",
              time: "-",
              type: "Male",
              name: `${preRegData.gender.male} registrants`,
              status: "Registered"
            },
            {
              id: 2,
              date: "-", 
              time: "-",
              type: "Female",
              name: `${preRegData.gender.female} registrants`,
              status: "Registered"
            },
            {
              id: 3,
              date: "-",
              time: "-",
              type: "Other",
              name: `${preRegData.gender.other} registrants`,
              status: "Registered"
            }
          ];
          
          return genderData;
        }
        
        // For Age tab - create age-based table data
        if (activeDataCategory === "age" && preRegData.age_ranges) {
          // Convert age data to table format
          const ageData = [
            {
              id: 1,
              date: "-",
              time: "-",
              type: "20-24",
              name: `${preRegData.age_ranges.range_20_24} registrants`,
              status: "Registered"
            },
            {
              id: 2,
              date: "-", 
              time: "-",
              type: "25-34",
              name: `${preRegData.age_ranges.range_25_34} registrants`,
              status: "Registered"
            },
            {
              id: 3,
              date: "-",
              time: "-",
              type: "35-44",
              name: `${preRegData.age_ranges.range_35_44} registrants`,
              status: "Registered"
            },
            {
              id: 4,
              date: "-",
              time: "-",
              type: "45-54",
              name: `${preRegData.age_ranges.range_45_54} registrants`,
              status: "Registered"
            },
            {
              id: 5,
              date: "-",
              time: "-",
              type: "55+",
              name: `${preRegData.age_ranges.range_55_plus} registrants`,
              status: "Registered"
            }
          ];
          
          return ageData;
        }
        
        // For Country tab - create country-based table data
        if (activeDataCategory === "country" && preRegData.countries && preRegData.countries.length > 0) {
          // Sort countries by count (descending)
          const sortedCountries = [...preRegData.countries].sort((a, b) => b.count - a.count);
          
          // Convert to table format
          const countryData = sortedCountries.map((item, index) => ({
            id: index + 1,
            date: "-",
            time: "-",
            type: item.country,
            name: `${item.count} registrants`,
            status: "Registered"
          }));
          
          return countryData;
        }
      } catch (error) {
        console.error("Error generating pre-registration table data:", error);
      }
    }
    
    // Return empty array if no data
    return [];
  };

  // Get table columns based on active category
  const getTableColumns = () => {
    // For all summary tabs (ticket type, gender, age, country), use the same column structure
    if (activeDataCategory === "ticketType" || activeDataCategory === "gender" || activeDataCategory === "age" || activeDataCategory === "country") {
      return (
        <>
          <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Count</TableCell>
        </>
      );
    }
    
    // Default columns (not used currently but kept for extensibility)
    return (
      <>
        <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
        <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
        <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
        <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
      </>
    );
  };

  // Modified chart rendering to handle different chart types
  const getChartComponent = () => {
    // Check if we have valid data for the chart
    if (!activeData.chartData) return renderNoDataMessage();
    
    // For ticket type, age, and country tabs, check if we have series data for horizontal bar charts
    if ((activeDataCategory === "ticketType" || activeDataCategory === "age" || activeDataCategory === "country") && 'series' in activeData.chartData) {
      // Check if we have actual data in the series
      if (!activeData.chartData.series.length || 
          !activeData.chartData.series[0].data.length || 
          activeData.chartData.series[0].data.every(value => value === 0)) {
        return renderNoDataMessage();
      }
      
      // Return horizontal bar chart (bars start on y-axis)
      return (
        <AnalyticsChart
          title=""
          type="bar"
          data={activeData.chartData}
        />
      );
    }
    
    // For pie charts, check if we have items data
    if (!isLineChart(activeData.chartData)) {
      if (!activeData.chartData.items.length || 
          activeData.chartData.items.every(item => item.value === 0)) {
        return renderNoDataMessage();
      }
    } else {
      // For line charts, check if we have series data
      if (!activeData.chartData.series.length || 
          !activeData.chartData.series[0].data.length ||
          activeData.chartData.series[0].data.every(value => value === 0)) {
        return renderNoDataMessage();
      }
    }
    
    // If we have data, render the appropriate chart
    return (
      <AnalyticsChart
        title=""
        type={isLineChart(activeData.chartData) ? "line" : "pie"}
        data={activeData.chartData}
      />
    );
  };
  
  // Helper to render no data message
  const renderNoDataMessage = () => (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        p: 3
      }}
    >
      <Typography variant="body1" color="text.secondary" align="center" gutterBottom>
        No data available for visualization
      </Typography>
      <Typography variant="caption" color="text.secondary" align="center">
        Try adjusting the date range or category
      </Typography>
    </Box>
  );

  // Update the record count display based on data source
  const getRecordsCount = () => {
    if (apiData && selectedDetailCard === 0) {
      return apiData.checked_in?.length || 0;
    } else if (preRegData && selectedDetailCard === 2) {
      return preRegData.registration_data?.length || 0;
    }
    return 0;
  };

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0, display: "none" }}
      animate={{
        x: showDetailView ? 0 : "100%",
        opacity: showDetailView ? 1 : 0,
        display: showDetailView ? "block" : "none",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Box sx={{ 
        width: '100%',
        height: '100%',
        position: 'relative'
      }}>
        {/* Breadcrumb Navigation */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={onClose}
              sx={{ 
                mr: 2,
                color: theme.palette.text.primary
              }}
            >
              Back
            </Button>
            <Breadcrumbs 
              separator={<NavigateNextIcon fontSize="small" />} 
              aria-label="breadcrumb"
            >
              <Typography 
                color="text.secondary" 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
                onClick={onClose}
              >
                Registration
              </Typography>
              <Typography color="text.primary">
                {detailedData.title}
              </Typography>
            </Breadcrumbs>
          </Box>
        </Box>
        
        {/* Date Range Selector - Moved above tabs */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ minWidth: 40 }}>
                    From:
                  </Typography>
                  <DateTimePicker
                    value={fromDate}
                    onChange={handleFromDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        variant: "outlined",
                        sx: {
                          maxWidth: 200,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            bgcolor: "background.paper",
                          },
                        },
                      },
                    }}
                    format="MMM dd, yyyy HH:mm"
                    ampm={false}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ minWidth: 40 }}>
                    To:
                  </Typography>
                  <DateTimePicker
                    value={toDate}
                    onChange={handleToDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        variant: "outlined",
                        sx: {
                          maxWidth: 200,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            bgcolor: "background.paper",
                          },
                        },
                      },
                    }}
                    format="MMM dd, yyyy HH:mm"
                    ampm={false}
                  />
                </Box>
              </Box>
            </LocalizationProvider>
        </Box>
        
        {/* Data Categories Filter Tabs */}
        <Box sx={{ mb: 3 }}>
          <Tabs 
            value={activeDataCategory} 
            onChange={handleCategoryChange} 
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 1,
                my: 0.5,
              },
              '& .Mui-selected': {
                color: '#F07135',
                bgcolor: alpha('#F07135', 0.08),
              },
              '& .MuiTabs-indicator': {
                display: 'none',
              },
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              bgcolor: 'background.paper',
            }}
          >
            <Tab value="ticketType" label="Ticket Type" />
            <Tab value="gender" label="Gender" />
            <Tab value="age" label="Age" />
            <Tab value="country" label="Country" />
          </Tabs>
        </Box>
        
        {/* Detail Content */}
        <Box sx={{ 
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden'
        }}>
          {/* Header with Title and Export Button */}
          <Box sx={{ 
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(240, 113, 53, 0.05)',
            py: 2.5,
            px: 3,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2
          }}>
            <Typography variant="h5" fontWeight={600} sx={{ color: '#F07135' }}>
              {activeData.title || detailedData.title}
            </Typography>
            
            {/* Export Button - Moved here from breadcrumb */}
            <Button 
              variant="contained" 
              startIcon={<DownloadIcon />}
              sx={{ 
                bgcolor: '#F07135',
                '&:hover': {
                  bgcolor: '#D5612C',
                }
              }}
            >
              Export Data
            </Button>
          </Box>
          
          {/* Description */}
          <Box sx={{ p: 3 }}>
            
            {/* Error message if API call fails */}
            {error && (
              <Box sx={{ mb: 3, p: 2, bgcolor: alpha(theme.palette.error.main, 0.1), borderRadius: 1 }}>
                <Typography color="error">{error}</Typography>
              </Box>
            )}
            
            {/* Loading indicator when fetching data */}
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress sx={{ color: '#F07135' }} />
              </Box>
            )}
            
            {/* Two-column layout for data table and chart */}
            {!isLoading && (
            <Grid container spacing={3}>
              {/* Left column - Data Table */}
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight={600}>
                      Detailed Data {getRecordsCount() > 0 ? `(${getRecordsCount()} records)` : ''}
                  </Typography>
                  <IconButton size="small">
                    <FilterListIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                <TableContainer component={Paper} sx={{ 
                  maxHeight: 400, 
                  overflowY: 'auto',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none'
                }}>
                  <Table stickyHeader sx={{ minWidth: 500 }} size="small">
                    <TableHead>
                      <TableRow>
                          {getTableColumns()}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                        {getTableData().length > 0 ? (
                          <>
                            {getTableData().map((row) => (
                        <TableRow
                          key={row.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                                {activeDataCategory === "ticketType" || activeDataCategory === "gender" || activeDataCategory === "age" || activeDataCategory === "country" ? (
                                  // Custom row rendering for all summary tabs
                                  <>
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                  </>
                                ) : (
                                  // Default row rendering (not used but kept for extensibility)
                                  <>
                          <TableCell>{row.date}</TableCell>
                          <TableCell>{row.time}</TableCell>
                          <TableCell>{row.type}</TableCell>
                          <TableCell>{row.name}</TableCell>
                                  </>
                                )}
                              </TableRow>
                            ))}
                            
                            {/* Summary row with total count */}
                            <TableRow sx={{ 
                              bgcolor: alpha(theme.palette.primary.main, 0.05),
                              '& td': { 
                                fontWeight: 600,
                                borderTop: '1px solid',
                                borderColor: 'divider'
                              }
                            }}>
                              <TableCell>
                                Total
                              </TableCell>
                              
                              {/* All tabs now use the same summary calculation */}
                              <TableCell>
                                {getTableData().reduce((sum, row) => {
                                  // Extract the number from strings like "123 attendees" or "123 registrants"
                                  const count = parseInt(row.name.split(' ')[0]);
                                  return sum + (isNaN(count) ? 0 : count);
                                }, 0)} {selectedDetailCard === 0 ? 'attendees' : 'registrants'}
                              </TableCell>
                            </TableRow>
                          </>
                        ) : (
                          <TableRow>
                            <TableCell 
                              colSpan={2} 
                              align="center" 
                              sx={{ py: 4 }}
                            >
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1" color="text.secondary">
                                  No data available for the selected time period
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Try adjusting the date range to see more results
                                </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              
              {/* Right column - Chart */}
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight={600}>
                    Visual Analytics
                  </Typography>
                  <IconButton size="small">
                    <MoreHorizIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                {/* Chart based on the type of data */}
                  {getChartComponent()}
                  
                  {/* Display information about limited data for country chart */}
                  {activeDataCategory === "country" && 
                   'series' in activeData.chartData && 
                   activeData.chartData.totalCountries && 
                   activeData.chartData.displayedCountries &&
                   activeData.chartData.totalCountries > activeData.chartData.displayedCountries && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ display: 'block', textAlign: 'center', mt: 1 }}
                    >
                      Showing top {activeData.chartData.displayedCountries} out of {activeData.chartData.totalCountries} countries
                    </Typography>
                  )}
                </Grid>
              </Grid>
            )}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}; 