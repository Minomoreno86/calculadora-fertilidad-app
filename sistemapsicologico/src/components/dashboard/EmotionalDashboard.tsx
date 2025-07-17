import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Alert,
  Button,
  LinearProgress
} from '@mui/material';
import {
  Psychology,
  Favorite,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Support
} from '@mui/icons-material';
import type { EmotionalDashboardData, TrendData } from '../../types/psychological';

interface EmotionalDashboardProps {
  data: EmotionalDashboardData;
  onInterventionClick: (type: string) => void;
  onUpdateMood: (mood: number, stress: number) => void;
}

// Helper functions
const getMoodEmoji = (mood: number): string => {
  if (mood >= 5) return '😊';
  if (mood >= 4) return '🙂';
  if (mood >= 3) return '😐';
  if (mood >= 2) return '😔';
  return '😞';
};

const getMoodLabel = (mood: number): string => {
  if (mood >= 4) return 'Bueno';
  if (mood >= 3) return 'Regular';
  return 'Difícil';
};

const getStressLevel = (stress: number) => {
  if (stress <= 13) return { label: 'Bajo', color: 'success' as const };
  if (stress <= 26) return { label: 'Moderado', color: 'warning' as const };
  return { label: 'Alto', color: 'error' as const };
};

const getTrendIcon = (direction: string) => {
  if (direction === 'up') return <TrendingUp sx={{ color: 'success.main', mr: 1 }} />;
  if (direction === 'down') return <TrendingDown sx={{ color: 'error.main', mr: 1 }} />;
  return <CheckCircle sx={{ color: 'info.main', mr: 1 }} />;
};

const getTrendColor = (direction: string): string => {
  if (direction === 'up') return 'success.main';
  if (direction === 'down') return 'error.main';
  return 'text.primary';
};

const getTrendSymbol = (direction: string): string => {
  if (direction === 'up') return '↗️';
  if (direction === 'down') return '↘️';
  return '➡️';
};

const getSupportColor = (level: number) => {
  if (level >= 70) return 'success' as const;
  if (level >= 40) return 'warning' as const;
  return 'error' as const;
};

const getCopingColor = (effectiveness: number) => {
  if (effectiveness >= 70) return 'success' as const;
  if (effectiveness >= 40) return 'warning' as const;
  return 'error' as const;
};

const getAlertSeverity = (type: string) => {
  if (type === 'danger') return 'error' as const;
  if (type === 'warning') return 'warning' as const;
  return 'info' as const;
};

export const EmotionalDashboard: React.FC<EmotionalDashboardProps> = ({
  data,
  onInterventionClick
}) => {
  const stressLevel = getStressLevel(data.currentStress);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 3 }}>
        📊 Dashboard Emocional
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Estado Emocional */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent sx={{ color: 'white' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Psychology sx={{ mr: 2, fontSize: 40 }} />
                <Typography variant="h5" fontWeight="bold">
                  Estado Emocional
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h2" sx={{ mb: 1 }}>
                  {getMoodEmoji(data.currentMood)}
                </Typography>
                <Typography variant="h6">
                  {getMoodLabel(data.currentMood)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Nivel actual: {data.currentMood}/5
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={(data.currentMood / 5) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white',
                    borderRadius: 4,
                  },
                }}
              />
            </CardContent>
          </Card>
        </Box>
        
        {/* Nivel de Estrés */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Favorite sx={{ mr: 2, color: 'error.main' }} />
                <Typography variant="h6">
                  Nivel de Estrés
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="h4" color={`${stressLevel.color}.main`}>
                  {data.currentStress}/40
                </Typography>
                <Chip 
                  label={stressLevel.label}
                  color={stressLevel.color}
                  sx={{ mt: 1 }}
                />
              </Box>

              <LinearProgress
                variant="determinate"
                value={(data.currentStress / 40) * 100}
                color={stressLevel.color}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Box>
        
        {/* Tendencias */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tendencias Recientes
              </Typography>
              
              {data.trends.map((trend: TrendData, index: number) => (
                <Box key={`trend-${trend.label}-${index}`} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {getTrendIcon(trend.direction)}
                    <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                      {trend.label}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ color: getTrendColor(trend.direction) }}
                    >
                      {getTrendSymbol(trend.direction)} {trend.change}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
        
        {/* Red de Apoyo */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Support sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">
                  Red de Apoyo
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Nivel de Apoyo Social
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={data.supportLevel}
                  color={getSupportColor(data.supportLevel)}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="body2">
                  {data.supportLevel}%
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Efectividad del Afrontamiento
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={data.copingEffectiveness}
                  color={getCopingColor(data.copingEffectiveness)}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="body2">
                  {data.copingEffectiveness}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        {/* Alertas */}
        <Box sx={{ flex: '1 1 100%' }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Alertas y Recomendaciones
              </Typography>
              
              {data.alerts.map((alert, index) => (
                <Alert 
                  key={`alert-${alert.type}-${index}`}
                  severity={getAlertSeverity(alert.type)}
                  sx={{ mb: 2 }}
                >
                  <Typography variant="body2" gutterBottom>
                    {alert.message}
                  </Typography>
                  
                  {alert.actions && (
                    <Box sx={{ mt: 1 }}>
                      {alert.actions.map((action: string, actionIndex: number) => (
                        <Button 
                          key={`action-${actionIndex}-${alert.type}`}
                          size="small" 
                          sx={{ mr: 1 }}
                          onClick={() => onInterventionClick(action)}
                        >
                          {action}
                        </Button>
                      ))}
                    </Box>
                  )}
                </Alert>
              ))}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};
