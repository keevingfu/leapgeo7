import { Box, Chip, Tooltip } from '@mui/material';
import { PLevel } from '@/types/roadmap.types';
import { priorityColors } from '@/utils/theme';

interface PriorityBadgeProps {
  level: PLevel;
  score?: number;
  size?: 'small' | 'medium';
  showScore?: boolean;
  animated?: boolean;
}

const priorityConfig = {
  P0: {
    label: 'P0 Core',
    description: 'Total Score ≥100, 8h/content, >75% citation prob, ROI 2 months',
    emoji: '🔴',
  },
  P1: {
    label: 'P1 Important',
    description: '75-100 score, 6h/content, 50-75% citation prob, ROI 3 months',
    emoji: '🟠',
  },
  P2: {
    label: 'P2 Opportunity',
    description: '50-75 score, 5h/content, 25-50% citation prob, ROI 4-6 months',
    emoji: '🟡',
  },
  P3: {
    label: 'P3 Reserve',
    description: '<50 score, 3h/content, <25% citation prob, strategic reserve',
    emoji: '🟢',
  },
};

export default function PriorityBadge({
  level,
  score,
  size = 'medium',
  showScore = false,
  animated = false,
}: PriorityBadgeProps) {
  const config = priorityConfig[level];
  const colors = priorityColors[level];

  return (
    <Tooltip title={config.description} arrow>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <Chip
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <span>{config.emoji}</span>
              <span style={{ fontWeight: 600 }}>{level}</span>
              {showScore && score && (
                <span style={{ fontSize: '0.85em', opacity: 0.8 }}>
                  ({score.toFixed(1)})
                </span>
              )}
            </Box>
          }
          size={size}
          sx={{
            bgcolor: colors.light,
            color: colors.dark,
            border: '2px solid',
            borderColor: colors.main,
            fontWeight: 600,
            fontSize: size === 'small' ? '0.75rem' : '0.875rem',
            ...(animated && {
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  boxShadow: `0 0 0 0 ${colors.main}40`,
                },
                '50%': {
                  boxShadow: `0 0 0 8px ${colors.main}00`,
                },
              },
            }),
          }}
        />
      </Box>
    </Tooltip>
  );
}
