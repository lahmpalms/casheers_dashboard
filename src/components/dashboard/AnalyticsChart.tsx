'use client';

import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, CardContent, Typography, Box, useTheme as useMuiTheme } from '@mui/material';
import { useTheme } from '@/components/ui/ThemeProvider';

interface AnalyticsChartProps {
  title: string;
  type: 'line' | 'bar' | 'pie';
  data: any;
}

export function AnalyticsChart({ title, type, data }: AnalyticsChartProps) {
  const muiTheme = useMuiTheme();
  const { mode } = useTheme();
  const [options, setOptions] = useState({});

  useEffect(() => {
    // Configure chart options based on type and theme
    if (type === 'line') {
      setOptions({
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.xAxis,
          axisLine: {
            lineStyle: {
              color: mode === 'dark' ? '#6b7280' : '#d1d5db',
            },
          },
          axisLabel: {
            color: mode === 'dark' ? '#e5e7eb' : '#374151',
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: mode === 'dark' ? '#6b7280' : '#d1d5db',
            },
          },
          axisLabel: {
            color: mode === 'dark' ? '#e5e7eb' : '#374151',
          },
          splitLine: {
            lineStyle: {
              color: mode === 'dark' ? 'rgba(107, 114, 128, 0.2)' : 'rgba(209, 213, 219, 0.5)',
            },
          },
        },
        series: data.series.map((series: any) => ({
          name: series.name,
          type: 'line',
          smooth: true,
          data: series.data,
          itemStyle: {
            color: series.color || muiTheme.palette.primary.main,
          },
          lineStyle: {
            width: 3,
          },
          areaStyle: series.showArea ? {
            opacity: 0.2,
          } : undefined,
        })),
      });
    } else if (type === 'bar') {
      setOptions({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: data.xAxis,
          axisLine: {
            lineStyle: {
              color: mode === 'dark' ? '#6b7280' : '#d1d5db',
            },
          },
          axisLabel: {
            color: mode === 'dark' ? '#e5e7eb' : '#374151',
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: mode === 'dark' ? '#6b7280' : '#d1d5db',
            },
          },
          axisLabel: {
            color: mode === 'dark' ? '#e5e7eb' : '#374151',
          },
          splitLine: {
            lineStyle: {
              color: mode === 'dark' ? 'rgba(107, 114, 128, 0.2)' : 'rgba(209, 213, 219, 0.5)',
            },
          },
        },
        series: data.series.map((series: any) => ({
          name: series.name,
          type: 'bar',
          data: series.data,
          itemStyle: {
            color: series.color || muiTheme.palette.primary.main,
            borderRadius: [4, 4, 0, 0],
          },
        })),
      });
    } else if (type === 'pie') {
      setOptions({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          textStyle: {
            color: mode === 'dark' ? '#e5e7eb' : '#374151',
          },
        },
        series: [
          {
            name: data.name,
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: mode === 'dark' ? '#1e293b' : '#ffffff',
              borderWidth: 2,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: data.items,
          },
        ],
      });
    }
  }, [type, data, mode, muiTheme.palette.primary.main]);

  return (
    <Card elevation={0} className="border border-gray-200 dark:border-gray-800 rounded-xl">
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ height: 300 }}>
          <ReactECharts
            option={options}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </Box>
      </CardContent>
    </Card>
  );
} 