import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  CircularProgress,
  Divider,
  Button,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CircleIcon from "@mui/icons-material/Circle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { motion } from "framer-motion";
import { ChartData, itemVariants } from "./types";

interface TicketDistributionChartProps {
  chartData: ChartData | null;
  isChartLoading: boolean;
  chartError: string | null;
  selectedDate: Date;
  selectedToDate: Date;
  activeTimeTab: number;
  handleDateChange: (date: Date | null) => void;
  handleToDateChange: (date: Date | null) => void;
  handleTimeTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  fetchChartData: () => void;
  formatChartDataForAnalytics: () => any;
  getChartColor: (index: number) => string;
}

export const TicketDistributionChart: React.FC<TicketDistributionChartProps> = ({
  chartData,
  isChartLoading,
  chartError,
  selectedDate,
  selectedToDate,
  activeTimeTab,
  handleDateChange,
  handleToDateChange,
  handleTimeTabChange,
  fetchChartData,
  formatChartDataForAnalytics,
  getChartColor,
}) => {
  const theme = useTheme();

  return (
    <motion.div variants={itemVariants}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "border.DEFAULT",
          mb: 4,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Most Active Attendees
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton size="small">
                <MoreHorizIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Date & Time Controls */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={activeTimeTab === 2 ? 3 : 3}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CalendarTodayIcon sx={{ color: "text.secondary" }} />
                  <Typography variant="body2" sx={{ minWidth: 40 }}>
                    From:
                  </Typography>
                  <DateTimePicker
                    value={selectedDate}
                    onChange={handleDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        variant: "outlined",
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            bgcolor: "background.paper",
                          },
                        },
                      },
                      layout: {
                        sx: {
                          ".MuiDateTimePickerTabs-root": {
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            borderRadius: 1,
                            mt: 1,
                            mb: 2,
                          },
                          ".MuiPickersDay-root.Mui-selected": {
                            bgcolor: theme.palette.primary.main,
                            color: "white",
                            "&:hover": {
                              bgcolor: theme.palette.primary.dark,
                            },
                          },
                          ".MuiClock-pin, .MuiClockPointer-root, .MuiClockPointer-thumb":
                            {
                              bgcolor: theme.palette.primary.main,
                            },
                        },
                      },
                    }}
                    format="MMM dd, yyyy HH:mm"
                    ampm={false}
                  />
                </Box>
              </Grid>

              {activeTimeTab === 2 && (
                <Grid item xs={12} md={3}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CalendarTodayIcon sx={{ color: "text.secondary" }} />
                    <Typography variant="body2" sx={{ minWidth: 40 }}>
                      To:
                    </Typography>
                    <DateTimePicker
                      value={selectedToDate}
                      onChange={handleToDateChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          variant: "outlined",
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              bgcolor: "background.paper",
                            },
                          },
                        },
                        layout: {
                          sx: {
                            ".MuiDateTimePickerTabs-root": {
                              bgcolor: alpha(
                                theme.palette.primary.main,
                                0.05
                              ),
                              borderRadius: 1,
                              mt: 1,
                              mb: 2,
                            },
                            ".MuiPickersDay-root.Mui-selected": {
                              bgcolor: theme.palette.primary.main,
                              color: "white",
                              "&:hover": {
                                bgcolor: theme.palette.primary.dark,
                              },
                            },
                            ".MuiClock-pin, .MuiClockPointer-root, .MuiClockPointer-thumb":
                              {
                                bgcolor: theme.palette.primary.main,
                              },
                          },
                        },
                      }}
                      format="MMM dd, yyyy HH:mm"
                      ampm={false}
                    />
                  </Box>
                </Grid>
              )}
            </Grid>

            <Tabs
              value={activeTimeTab}
              onChange={handleTimeTabChange}
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                mb: 2,
                "& .MuiTabs-indicator": {
                  backgroundColor: theme.palette.primary.main,
                },
                "& .MuiTab-root": {
                  minWidth: "auto",
                  py: 1,
                  px: 2,
                  borderRadius: 2,
                  mr: 1,
                  color: "text.primary",
                  "&.Mui-selected": {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                    fontWeight: 600,
                  },
                },
              }}
            >
              <Tab label="Last 12 hours" sx={{ textTransform: "none" }} />
              <Tab label="Last 24 hours" sx={{ textTransform: "none" }} />
              <Tab label="Custom" sx={{ textTransform: "none" }} />
            </Tabs>
          </LocalizationProvider>

          <Divider sx={{ mb: 3 }} />

          {/* Chart Section */}
          <Box sx={{ position: "relative", height: 400 }}>
            {isChartLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress sx={{ color: "#F07135" }} />
              </Box>
            ) : chartError ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography color="error" gutterBottom>
                  {chartError}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={fetchChartData}
                  startIcon={<CircleIcon sx={{ fontSize: 14 }} />}
                  sx={{ mt: 2 }}
                >
                  Retry
                </Button>
              </Box>
            ) : chartData && chartData.ticket_type_data.length > 0 ? (
              <Box sx={{ height: "100%", width: "100%" }}>
                <AnalyticsChart
                  title="Attendee Registration Over Time"
                  type="stacked-bar"
                  data={formatChartDataForAnalytics()}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography color="text.secondary">
                  No ticket data available for the selected time period
                </Typography>
              </Box>
            )}
          </Box>

          {/* Ticket Distribution Legend */}
          {!isChartLoading &&
            !chartError &&
            chartData &&
            chartData.ticket_type_data.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Ticket Summary
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {Array.from(
                    new Set(
                      chartData.ticket_type_data.map(
                        (item) => item.ticket_type
                      )
                    )
                  ).map((ticketType, index) => {
                    // Calculate total for this ticket type
                    const ticketTotal = chartData.ticket_type_data
                      .filter((item) => item.ticket_type === ticketType)
                      .reduce((sum, item) => sum + item.count, 0);

                    // Calculate overall total
                    const totalTickets = chartData.ticket_type_data.reduce(
                      (sum, item) => sum + item.count,
                      0
                    );

                    const percentage =
                      totalTickets > 0
                        ? Math.round((ticketTotal / totalTickets) * 100)
                        : 0;

                    return (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 1.5,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                            bgcolor: alpha(getChartColor(index), 0.05),
                          }}
                        >
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              bgcolor: getChartColor(index),
                              mr: 1.5,
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Tooltip title={ticketType} placement="top" arrow>
                              <Typography
                                variant="body2"
                                noWrap
                                sx={{
                                  maxWidth: "100%",
                                  display: "inline-block",
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                }}
                              >
                                {ticketType}
                              </Typography>
                            </Tooltip>
                            <Box
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                color="primary"
                              >
                                {ticketTotal.toLocaleString()}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ ml: 1 }}
                              >
                                ({percentage}%)
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            )}
        </CardContent>
      </Card>
    </motion.div>
  );
}; 