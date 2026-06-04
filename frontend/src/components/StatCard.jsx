import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

export default function StatCard({
  title,
  value,
  icon,
  iconBg,
  subtext,
  trend,
  trendColor,
  loading = false,
  customContent = null,
}) {
  const theme = useTheme();

  return (
    <MotionCard
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4, boxShadow: theme.palette.mode === 'light' 
        ? '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)'
        : '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)'
      }}
      sx={{
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          {loading ? (
            <Skeleton variant="text" width="60%" height={24} />
          ) : (
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: '0.2px' }}>
              {title}
            </Typography>
          )}
          {loading ? (
            <Skeleton variant="circular" width={40} height={40} />
          ) : (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: iconBg || 'rgba(99, 102, 241, 0.1)',
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        {loading ? (
          <Box sx={{ mb: 1 }}>
            <Skeleton variant="text" width="50%" height={40} />
            <Skeleton variant="text" width="80%" height={16} />
          </Box>
        ) : (
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-1px' }}>
              {value}
            </Typography>

            {customContent}

            {trend || subtext ? (
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                {trend && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: trendColor || 'success.main',
                      mr: 0.5,
                    }}
                  >
                    {trend}
                  </Typography>
                )}
                {subtext && (
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {subtext}
                  </Typography>
                )}
              </Box>
            ) : null}
          </Box>
        )}
      </CardContent>
    </MotionCard>
  );
}
