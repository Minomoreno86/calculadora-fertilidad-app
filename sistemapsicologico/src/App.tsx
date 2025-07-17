import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box, AppBar, Toolbar, Typography, Tab, Tabs } from '@mui/material';
import { Psychology, Dashboard, Assessment, TrendingUp } from '@mui/icons-material';
import { PSS10Component } from './components/assessments/PSS10Component';
import { EmotionalDashboard } from './components/dashboard/EmotionalDashboard';
import type { PSS10Assessment, EmotionalDashboardData } from './types/psychological';

// Tema personalizado para fertilidad
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Verde fertilidad
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#8E24AA', // Púrpura bienestar
      light: '#BA68C8',
      dark: '#4A148C',
    },
    background: {
      default: '#F1F8E9',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

interface TabPanelProps {
  readonly children?: React.ReactNode;
  readonly index: number;
  readonly value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [assessments, setAssessments] = useState<PSS10Assessment[]>([]);
  
  // Mock data para el dashboard emocional
  const dashboardData: EmotionalDashboardData = {
    currentMood: 3,
    currentStress: 18,
    stressLevel: 18, // Moderado
    anxietyLevel: 15,
    supportLevel: 65,
    copingEffectiveness: 55,
    weeklyTrend: [
      { date: new Date(2025, 6, 10), mood: 2, stress: 25 },
      { date: new Date(2025, 6, 11), mood: 3, stress: 22 },
      { date: new Date(2025, 6, 12), mood: 3, stress: 20 },
      { date: new Date(2025, 6, 13), mood: 4, stress: 18 },
      { date: new Date(2025, 6, 14), mood: 3, stress: 16 },
      { date: new Date(2025, 6, 15), mood: 3, stress: 18 },
      { date: new Date(2025, 6, 16), mood: 3, stress: 18 },
    ],
    trends: [
      { label: 'Estado de ánimo', direction: 'stable', change: 0 },
      { label: 'Nivel de estrés', direction: 'down', change: -8 },
      { label: 'Calidad del sueño', direction: 'up', change: 12 }
    ],
    alerts: [
      {
        id: '1',
        type: 'warning',
        message: 'Tu nivel de estrés está en rango moderado. Considera técnicas de relajación.',
        timestamp: new Date(),
        actionRequired: true,
        actions: ['Practicar mindfulness', 'Ejercicio suave']
      }
    ]
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handlePSS10Complete = (assessment: PSS10Assessment) => {
    setAssessments(prev => [...prev, assessment]);
    console.log('Evaluación PSS-10 completada:', assessment);
  };

  const handleInterventionClick = (type: string) => {
    console.log('Intervención solicitada:', type);
    // Aquí se implementaría la navegación a los recursos específicos
  };

  const handleUpdateMood = (mood: number, stress: number) => {
    console.log('Actualizar estado:', { mood, stress });
    // Aquí se implementaría la actualización del estado actual
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Psychology sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Sistema Psicológico de Fertilidad
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Módulo Psicológico v1.0
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={handleTabChange} aria-label="Tabs del sistema">
              <Tab 
                icon={<Dashboard />} 
                label="Dashboard Emocional" 
                id="tab-0"
                aria-controls="tabpanel-0"
              />
              <Tab 
                icon={<Assessment />} 
                label="Evaluación PSS-10" 
                id="tab-1"
                aria-controls="tabpanel-1"
              />
              <Tab 
                icon={<TrendingUp />} 
                label="Análisis y Tendencias" 
                id="tab-2"
                aria-controls="tabpanel-2"
              />
            </Tabs>
          </Box>

          <TabPanel value={currentTab} index={0}>
            <EmotionalDashboard 
              data={dashboardData}
              onInterventionClick={handleInterventionClick}
              onUpdateMood={handleUpdateMood}
            />
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <PSS10Component 
              onComplete={handlePSS10Complete}
              patientId="demo_patient_001"
            />
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                📊 Análisis y Tendencias
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Módulo en desarrollo. Aquí se mostrarán análisis longitudinales,
                correlaciones con factores clínicos y predicciones de IA.
              </Typography>
              
              {assessments.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Evaluaciones Completadas: {assessments.length}
                  </Typography>
                  {assessments.map((assessment, index) => (
                    <Box key={assessment.id} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                      <Typography variant="body1">
                        PSS-10 #{index + 1}: {assessment.totalScore}/40 - Nivel {assessment.riskLevel}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {assessment.timestamp.toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </TabPanel>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
