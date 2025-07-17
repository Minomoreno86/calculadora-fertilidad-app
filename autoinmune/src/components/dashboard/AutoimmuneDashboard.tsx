import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
  IconButton
} from '@mui/material';
import {
  Dashboard,
  MedicalServices,
  Medication,
  Info,
  Assignment,
  BabyChangingStation,
  LocalHospital,
  Science
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import type { 
  AutoimmunePatientProfile, 
  FertilityRiskAssessment,
  ClinicalRecommendation 
} from '../../types/autoimmune';
import { AutoimmuneFertilityRiskCalculator } from '../../algorithms/riskCalculator';

interface AutoimmuneDashboardProps {
  patientProfile: AutoimmunePatientProfile;
  onEditProfile?: () => void;
  onNewAssessment?: () => void;
}

const RISK_COLORS = {
  low: '#4caf50',
  moderate: '#ff9800',
  high: '#f44336',
  severe: '#d32f2f'
};

const RISK_LABELS = {
  low: 'Bajo',
  moderate: 'Moderado', 
  high: 'Alto',
  severe: 'Severo'
};

export const AutoimmuneDashboard: React.FC<AutoimmuneDashboardProps> = ({
  patientProfile,
  onEditProfile,
  onNewAssessment
}) => {
  const [riskAssessment, setRiskAssessment] = useState<FertilityRiskAssessment | null>(null);
  const [recommendations, setRecommendations] = useState<ClinicalRecommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<ClinicalRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const assessment = AutoimmuneFertilityRiskCalculator.assessFertilityRisk(patientProfile);
      
      setRiskAssessment(assessment);
      setRecommendations(assessment.recommendations);
    } catch (error) {
      console.error('Error en evaluación de riesgo:', error);
    } finally {
      setIsLoading(false);
    }
  }, [patientProfile]);

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Analizando perfil médico...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (!riskAssessment) {
    return (
      <Alert severity="error">
        Error al calcular la evaluación de riesgo. Intente nuevamente.
      </Alert>
    );
  }

  const getRiskColor = (risk: string) => RISK_COLORS[risk as keyof typeof RISK_COLORS];
  const getRiskLabel = (risk: string) => RISK_LABELS[risk as keyof typeof RISK_LABELS];

  // Datos para gráficos basados en la estructura real de FertilityRiskAssessment
  const riskByCategory = riskAssessment.riskFactors.reduce((acc, factor) => {
    if (!acc[factor.category]) acc[factor.category] = [];
    acc[factor.category].push(factor);
    return acc;
  }, {} as Record<string, typeof riskAssessment.riskFactors>);

  const medicationRiskData = patientProfile.currentMedications.map(med => {
    const fertilityRiskValues = Object.values(med.medication.fertilityRisk);
    const hasHighRisk = fertilityRiskValues.some(risk => risk === 'high' || risk === 'severe');
    const hasModerateRisk = fertilityRiskValues.some(risk => risk === 'moderate');
    const hasLowRisk = fertilityRiskValues.some(risk => risk === 'low');
    
    return {
      name: med.medication.name,
      teratogenicity: med.medication.teratogenicity.level === 'none' ? 0 : 
                     med.medication.teratogenicity.level === 'low' ? 1 :
                     med.medication.teratogenicity.level === 'moderate' ? 2 : 3,
      fertilityRisk: hasHighRisk ? 3 : hasModerateRisk ? 2 : hasLowRisk ? 1 : 0
    };
  });

  const radarData = [
    {
      factor: 'Act. Enfermedad',
      riesgo: (riskByCategory['activity']?.length || 0) * 25
    },
    {
      factor: 'Medicamentos',
      riesgo: (riskByCategory['medication']?.length || 0) * 25
    },
    {
      factor: 'Edad',
      riesgo: (riskByCategory['age']?.length || 0) * 25
    },
    {
      factor: 'Historial',
      riesgo: (riskByCategory['history']?.length || 0) * 25
    },
    {
      factor: 'Enfermedad',
      riesgo: (riskByCategory['disease']?.length || 0) * 25
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Dashboard sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" color="primary">
            Dashboard Médico Autoinmune
          </Typography>
        </Box>
        <Box>
          <Button variant="outlined" onClick={onEditProfile} sx={{ mr: 1 }}>
            Editar Perfil
          </Button>
          <Button variant="contained" onClick={onNewAssessment}>
            Nueva Evaluación
          </Button>
        </Box>
      </Box>

      {/* Información del paciente */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            👤 Información del Paciente
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <Typography variant="body2" color="text.secondary">Edad</Typography>
              <Typography variant="h6">{patientProfile.age} años</Typography>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <Typography variant="body2" color="text.secondary">Diagnósticos</Typography>
              <Typography variant="h6">{patientProfile.diagnoses.length}</Typography>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <Typography variant="body2" color="text.secondary">Medicamentos</Typography>
              <Typography variant="h6">{patientProfile.currentMedications.length}</Typography>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <Typography variant="body2" color="text.secondary">Última Evaluación</Typography>
              <Typography variant="h6">
                {patientProfile.lastAssessment.toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Alertas críticas - basadas en factores de alto riesgo */}
      {riskAssessment.riskFactors.filter(rf => rf.impact === 'high' || rf.impact === 'severe').length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            ⚠️ Factores de Alto Riesgo
          </Typography>
          {riskAssessment.riskFactors
            .filter(rf => rf.impact === 'high' || rf.impact === 'severe')
            .map((factor, index) => (
            <Typography key={index} variant="body2">
              • {factor.description}
            </Typography>
          ))}
        </Alert>
      )}

      {/* Resumen de riesgo general */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <BabyChangingStation sx={{ fontSize: 48, color: getRiskColor(riskAssessment.overallRisk), mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Riesgo General
              </Typography>
              <Chip 
                label={getRiskLabel(riskAssessment.overallRisk)}
                color={riskAssessment.overallRisk === 'low' ? 'success' : 
                       riskAssessment.overallRisk === 'moderate' ? 'warning' : 'error'}
              />
              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                Evaluación integral de fertilidad ({riskAssessment.estimatedConceptionProbability}% probabilidad)
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <LocalHospital sx={{ fontSize: 48, color: getRiskColor(riskAssessment.optimalTimingWindow.currentRisk), mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Timing Óptimo
              </Typography>
              <Chip 
                label={getRiskLabel(riskAssessment.optimalTimingWindow.currentRisk)}
                color={riskAssessment.optimalTimingWindow.currentRisk === 'low' ? 'success' : 
                       riskAssessment.optimalTimingWindow.currentRisk === 'moderate' ? 'warning' : 'error'}
              />
              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                {riskAssessment.optimalTimingWindow.optimal ? 'Momento óptimo' : 'Requiere preparación'}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Science sx={{ fontSize: 48, color: getRiskColor(riskAssessment.overallRisk), mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Factores Protectores
              </Typography>
              <Chip 
                label={`${riskAssessment.protectiveFactors.length} Factores`}
                color={riskAssessment.protectiveFactors.length > 2 ? 'success' : 
                       riskAssessment.protectiveFactors.length > 0 ? 'warning' : 'error'}
              />
              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                Elementos que favorecen la fertilidad
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Gráficos de análisis */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Análisis de Factores de Riesgo
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="factor" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar 
                    name="Riesgo" 
                    dataKey="riesgo" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        {medicationRiskData.length > 0 && (
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  💊 Riesgo de Medicamentos
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={medicationRiskData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 3]} />
                    <RechartsTooltip />
                    <Bar dataKey="teratogenicity" fill="#ff9800" name="Teratogenicidad" />
                    <Bar dataKey="fertilityRisk" fill="#f44336" name="Riesgo Fertilidad" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>

      {/* Diagnósticos actuales */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🏥 Diagnósticos Autoinmunes
              </Typography>
              <List>
                {patientProfile.diagnoses.map((diagnosis, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <MedicalServices color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={diagnosis.disease.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Actividad: {diagnosis.currentActivity.status}
                            </Typography>
                            <Chip 
                              label={`Impacto: ${diagnosis.disease.fertilityImpact}`}
                              size="small"
                              color={
                                diagnosis.disease.fertilityImpact === 'low' ? 'success' :
                                diagnosis.disease.fertilityImpact === 'moderate' ? 'warning' : 'error'
                              }
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < patientProfile.diagnoses.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💊 Medicamentos Actuales
              </Typography>
              <List>
                {patientProfile.currentMedications.map((medication, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <Medication color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${medication.medication.name} ${medication.dose}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Frecuencia: {medication.frequency}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                              <Chip 
                                label={`Cat. ${medication.medication.pregnancyCategory}`}
                                size="small"
                                color={
                                  medication.medication.pregnancyCategory === 'A' || medication.medication.pregnancyCategory === 'B' 
                                    ? 'success' 
                                    : medication.medication.pregnancyCategory === 'C' 
                                    ? 'warning' 
                                    : 'error'
                                }
                              />
                              {medication.medication.washoutPeriod && (
                                <Chip 
                                  label={`Lavado: ${medication.medication.washoutPeriod}d`}
                                  size="small"
                                  color="info"
                                />
                              )}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < patientProfile.currentMedications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Recomendaciones clínicas */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🎯 Recomendaciones Clínicas
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {recommendations.map((rec, index) => (
              <Box key={index} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'grey.50' }
                  }}
                  onClick={() => setSelectedRecommendation(rec)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <Assignment sx={{ mr: 1, color: 'primary.main' }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1">
                        {rec.category} - {rec.specialist || 'General'}
                      </Typography>
                      <Chip 
                        label={rec.priority}
                        size="small"
                        color={rec.priority === 'high' || rec.priority === 'urgent' ? 'error' : rec.priority === 'medium' ? 'warning' : 'success'}
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {rec.recommendation.substring(0, 100)}...
                      </Typography>
                    </Box>
                    <IconButton size="small">
                      <Info />
                    </IconButton>
                  </Box>
                </Paper>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Dialog para recomendación detallada */}
      <Dialog 
        open={!!selectedRecommendation} 
        onClose={() => setSelectedRecommendation(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedRecommendation && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Assignment sx={{ mr: 1 }} />
                {selectedRecommendation.category} - {selectedRecommendation.specialist || 'General'}
                <Chip 
                  label={selectedRecommendation.priority}
                  size="small"
                  color={selectedRecommendation.priority === 'high' || selectedRecommendation.priority === 'urgent' ? 'error' : 
                         selectedRecommendation.priority === 'medium' ? 'warning' : 'success'}
                  sx={{ ml: 2 }}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" gutterBottom>
                {selectedRecommendation.recommendation}
              </Typography>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Nivel de evidencia:</strong> {selectedRecommendation.evidence}
                </Typography>
              </Alert>

              <Alert severity="info" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Marco temporal:</strong> {selectedRecommendation.timeframe}
                </Typography>
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedRecommendation(null)}>
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};
