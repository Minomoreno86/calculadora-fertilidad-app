import React, { useState } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline,
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Alert
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Assignment,
  MedicalServices,
  Settings,
  Help,
  Home,
  Science
} from '@mui/icons-material';
import { AutoimmuneAssessment } from './components/assessment/AutoimmuneAssessment';
import { AutoimmuneDashboard } from './components/dashboard/AutoimmuneDashboard';
import type { AutoimmunePatientProfile } from './types/autoimmune';

// Tema personalizado para aplicación médica
const medicalTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Azul médico profesional
      light: '#42a5f5',
      dark: '#1565c0'
    },
    secondary: {
      main: '#dc004e', // Rojo para alertas médicas
      light: '#ff5983',
      dark: '#9a0036'
    },
    success: {
      main: '#2e7d32', // Verde para indicadores positivos
    },
    warning: {
      main: '#ed6c02', // Naranja para precauciones
    },
    error: {
      main: '#d32f2f', // Rojo para riesgos altos
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    }
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0,0,0,0.05)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500
        }
      }
    }
  }
});

type AppView = 'home' | 'assessment' | 'dashboard' | 'settings';

interface AppState {
  currentView: AppView;
  patientProfile: AutoimmunePatientProfile | null;
  drawerOpen: boolean;
}

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentView: 'home',
    patientProfile: null,
    drawerOpen: false
  });

  const handleAssessmentComplete = (profile: AutoimmunePatientProfile) => {
    setAppState(prev => ({
      ...prev,
      patientProfile: profile,
      currentView: 'dashboard'
    }));
  };

  const handleNewAssessment = () => {
    setAppState(prev => ({
      ...prev,
      currentView: 'assessment'
    }));
  };

  const handleEditProfile = () => {
    setAppState(prev => ({
      ...prev,
      currentView: 'assessment',
      patientProfile: appState.patientProfile // Mantener el perfil para edición
    }));
  };

  const toggleDrawer = () => {
    setAppState(prev => ({
      ...prev,
      drawerOpen: !prev.drawerOpen
    }));
  };

  const navigateTo = (view: AppView) => {
    setAppState(prev => ({
      ...prev,
      currentView: view,
      drawerOpen: false
    }));
  };

  const renderMainContent = () => {
    switch (appState.currentView) {
      case 'home':
        return (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Science sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
            <Typography variant="h3" gutterBottom color="primary">
              Módulo Autoinmune
            </Typography>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Evaluación de Fertilidad en Enfermedades Autoinmunes
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              Sistema especializado para evaluar el impacto de enfermedades autoinmunes 
              en la fertilidad y proporcionar recomendaciones clínicas basadas en evidencia.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                size="large" 
                startIcon={<Assignment />}
                onClick={() => navigateTo('assessment')}
              >
                Nueva Evaluación
              </Button>
              
              {appState.patientProfile && (
                <Button 
                  variant="outlined" 
                  size="large" 
                  startIcon={<Dashboard />}
                  onClick={() => navigateTo('dashboard')}
                >
                  Ver Dashboard
                </Button>
              )}
            </Box>

            <Box sx={{ mt: 6 }}>
              <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
                <Typography variant="h6" gutterBottom>
                  🎯 Características del Módulo
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" color="primary">
                      ✅ Evaluación Integral
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      15 enfermedades autoinmunes con impacto en fertilidad
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color="primary">
                      💊 Análisis de Medicamentos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Evaluación de teratogenicidad y riesgo reproductivo
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color="primary">
                      📊 Algoritmos Clínicos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Basados en evidencia médica actualizada
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color="primary">
                      🎯 Recomendaciones Personalizadas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Guías específicas para optimización preconcepcional
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        );

      case 'assessment':
        return (
          <AutoimmuneAssessment
            onComplete={handleAssessmentComplete}
            patientId={`patient-${Date.now()}`}
          />
        );

      case 'dashboard':
        return appState.patientProfile ? (
          <AutoimmuneDashboard
            patientProfile={appState.patientProfile}
            onEditProfile={handleEditProfile}
            onNewAssessment={handleNewAssessment}
          />
        ) : (
          <Alert severity="warning">
            No hay perfil de paciente disponible. Realice una evaluación primero.
          </Alert>
        );

      case 'settings':
        return (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Settings sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
            <Typography variant="h4" gutterBottom>
              Configuración
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Panel de configuración en desarrollo
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  const menuItems = [
    { text: 'Inicio', icon: <Home />, view: 'home' as AppView },
    { text: 'Nueva Evaluación', icon: <Assignment />, view: 'assessment' as AppView },
    { text: 'Dashboard', icon: <Dashboard />, view: 'dashboard' as AppView, disabled: !appState.patientProfile },
    { text: 'Configuración', icon: <Settings />, view: 'settings' as AppView }
  ];

  return (
    <ThemeProvider theme={medicalTheme}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar position="fixed" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <MedicalServices sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Módulo Autoinmune - Calculadora de Fertilidad
          </Typography>
          
          <Button 
            color="inherit" 
            startIcon={<Help />}
            onClick={() => alert('Ayuda en desarrollo')}
          >
            Ayuda
          </Button>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Drawer
        anchor="left"
        open={appState.drawerOpen}
        onClose={toggleDrawer}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem 
                key={item.text}
                onClick={() => navigateTo(item.view)}
                disabled={item.disabled}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 8, py: 3 }}>
        {renderMainContent()}
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          bgcolor: 'background.paper', 
          py: 3, 
          mt: 4,
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 Módulo Autoinmune - Calculadora de Fertilidad. 
            Desarrollado para evaluación médica especializada.
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App
