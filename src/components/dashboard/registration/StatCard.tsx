import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  alpha,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { motion } from "framer-motion";
import { itemVariants } from "./types";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  index: number;
  onDetailClick: () => void;
  disabled?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  index,
  onDetailClick,
  disabled = false,
}) => {
  return (
    <motion.div variants={itemVariants}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          height: "100%",
          background: `linear-gradient(135deg, ${
            index % 2 !== 0 ? alpha(color, 1) : alpha(color, 1)
          } 0%, 
            ${
              index % 2 !== 0 ? alpha(color, 0.6) : alpha(color, 0.9)
            } 100%)`,
          color: "white",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: disabled ? "none" : "translateY(-4px)",
            boxShadow: disabled ? "none" : "0 8px 16px rgba(0, 0, 0, 0.1)",
          },
          opacity: disabled ? 0.7 : 1,
        }}
      >
        <CardContent
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {/* Top Section: Number & Icon */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" color="white" component="div" fontWeight={700}>
              {value}
            </Typography>
            <Box sx={{ display: "flex", fontSize: 48 }}>
              {icon}
            </Box>
          </Box>

          {/* Middle Section: Title */}
          <Typography variant="h6" color="white" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
        </CardContent>

        {/* Bottom Section: Actions */}
        <CardActions
          sx={{
            p: 2,
            paddingTop: "6px",
            paddingRight: "25px",
            paddingBottom: "6px",
            paddingLeft: "25px",
            borderRadius: "0 0 10px 10px",
            backgroundColor: alpha("#000", 0.1),
          }}
        >
          <Button
            variant="text"
            size="small"
            disabled={disabled}
            sx={{
              color: "white",
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              borderRadius: 1.5,
              px: 1,
              "&:hover": {
                backgroundColor: disabled ? "transparent" : alpha("#ffffff", 0.2),
              },
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? "default" : "pointer",
            }}
            endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
            onClick={disabled ? undefined : onDetailClick}
          >
            More Detail
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
}; 