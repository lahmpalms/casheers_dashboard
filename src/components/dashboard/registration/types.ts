import { ReactNode } from "react";

export interface RegistrationData {
  total_checkin: number;
  pickup_wristband: number;
  pre_registration: number;
  door_sale: number;
}

export interface TicketTypeData {
  ticket_type: string;
  count: number;
  checkin_at?: number;
}

export interface ChartData {
  ticket_type_data: TicketTypeData[];
  timestamp?: number;
}

export interface HourlyTicketData {
  hour: string;
  date?: Date;
  timestamp?: number;
  tickets: {
    [ticketType: string]: number;
  };
  total: number;
}

export interface StatCardItem {
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
}

export interface StatDetail {
  label: string;
  value: string;
}

export interface DetailedData {
  title: string;
  summary: string;
  chart: any;
  stats: StatDetail[];
}

// Animation variants
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
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