import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Paper,
  LinearProgress,
  Autocomplete,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider
} from '@mui/material';
import {
  MedicalServices,
  Assignment,
  Medication,
  CheckCircle
} from '@mui/icons-material';
import type { 
  AutoimmunePatientProfile, 
  PatientDiagnosis, 
  PatientMedication,
  AutoimmuneDisease,
  Medication as MedicationType,
  DiseaseActivity,
  ActivityStatus
} from '../../types/autoimmune';
import { AUTOIMMUNE_DISEASES } from '../../data/diseases';
import { AUTOIMMUNE_MEDICATIONS } from '../../data/medications';

interface AutoimmuneAssessmentProps {
  onComplete: (profile: AutoimmunePatientProfile) => void;
  patientId: string;
}

const ASSESSMENT_STEPS = [
  'Información Básica',
  'Diagnósticos',
  'Medicamentos Actuales',
  'Objetivos Reproductivos',
  'Revisión y Confirmación'
];

export const AutoimmuneAssessment: React.FC<AutoimmuneAssessmentProps> = ({
  onComplete,
  patientId
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Estados del formulario
  const [basicInfo, setBasicInfo] = useState({
    age: 30,
    previousPregnancies: 0,
    timeToConception: 'immediate' as 'immediate' | '6months' | '1year' | '2years'
  });
  
  const [selectedDiseases, setSelectedDiseases] = useState<PatientDiagnosis[]>([]);
  const [selectedMedications, setSelectedMedications] = useState<PatientMedication[]>([]);
  const [reproductiveGoals, setReproductiveGoals] = useState({
    desiredTimeframe: 'immediate' as 'immediate' | '6months' | '1year' | '2years' | 'undecided',
    assistedReproduction: false
  });

  const handleNext = () => {
    if (currentStep < ASSESSMENT_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleComplete = () => {
    const profile: AutoimmunePatientProfile = {
      id: patientId,
      age: basicInfo.age,
      diagnoses: selectedDiseases,
      currentMedications: selectedMedications,
      diseaseHistory: {
        timeToControlDisease: 12,
        numberOfFlares: 0,
        hospitalizations: 0,
        organDamage: [],
        diseaseProgression: 'stable'
      },
      fertilityGoals: {
        desiredTimeframe: reproductiveGoals.desiredTimeframe,
        previousAttempts: 0,
        previousPregnancies: [],
        assistedReproduction: reproductiveGoals.assistedReproduction
      },
      riskFactors: [],
      lastAssessment: new Date()
    };

    setIsComplete(true);
    onComplete(profile);
  };

  const addDisease = (disease: AutoimmuneDisease) => {
    const newDiagnosis: PatientDiagnosis = {
      disease,
      diagnosisDate: new Date(),
      currentActivity: {
        status: 'remission',
        currentSymptoms: [],
        biomarkers: []
      },
      complications: [],
      specialists: []
    };
    setSelectedDiseases(prev => [...prev, newDiagnosis]);
  };

  const updateDiseaseActivity = (index: number, activity: DiseaseActivity) => {
    setSelectedDiseases(prev => 
      prev.map((diag, i) => i === index ? { ...diag, currentActivity: activity } : diag)
    );
  };

  const addMedication = (medication: MedicationType) => {
    const newMedication: PatientMedication = {
      medication,
      dose: '',
      frequency: 'daily',
      startDate: new Date(),
      indication: '',
      effectiveness: 'good',
      sideEffects: []
    };
    setSelectedMedications(prev => [...prev, newMedication]);
  };

  const updateMedicationDetails = (index: number, updates: Partial<PatientMedication>) => {
    setSelectedMedications(prev =>
      prev.map((med, i) => i === index ? { ...med, ...updates } : med)
    );
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              📋 Información Básica del Paciente
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth>
                  <FormLabel>Edad</FormLabel>
                  <Slider
                    value={basicInfo.age}
                    onChange={(_, value) => setBasicInfo(prev => ({ ...prev, age: value as number }))}
                    min={18}
                    max={50}
                    marks={[
                      { value: 20, label: '20' },
                      { value: 30, label: '30' },
                      { value: 40, label: '40' },
                      { value: 50, label: '50' }
                    ]}
                    valueLabelDisplay="on"
                  />
                </FormControl>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth>
                  <FormLabel>Embarazos Previos</FormLabel>
                  <Select
                    value={basicInfo.previousPregnancies}
                    onChange={(e) => setBasicInfo(prev => ({ ...prev, previousPregnancies: e.target.value as number }))}
                  >
                    <MenuItem value={0}>Ninguno</MenuItem>
                    <MenuItem value={1}>1 embarazo</MenuItem>
                    <MenuItem value={2}>2 embarazos</MenuItem>
                    <MenuItem value={3}>3+ embarazos</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ width: '100%' }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Tiempo Deseado para Concepción</FormLabel>
                  <RadioGroup
                    value={basicInfo.timeToConception}
                    onChange={(e) => setBasicInfo(prev => ({ ...prev, timeToConception: e.target.value as 'immediate' | '6months' | '1year' | '2years' }))}
                  >
                    <FormControlLabel value="immediate" control={<Radio />} label="Inmediato (0-3 meses)" />
                    <FormControlLabel value="6months" control={<Radio />} label="6 meses" />
                    <FormControlLabel value="1year" control={<Radio />} label="1 año" />
                    <FormControlLabel value="2years" control={<Radio />} label="2+ años" />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              🏥 Diagnósticos de Enfermedades Autoinmunes
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Autocomplete
                options={AUTOIMMUNE_DISEASES}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} label="Buscar enfermedad autoinmune" />
                )}
                onChange={(_, value) => value && addDisease(value)}
              />
            </Box>

            {selectedDiseases.map((diagnosis, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MedicalServices sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                    {diagnosis.disease.name}
                  </Typography>
                  <Chip 
                    label={diagnosis.disease.fertilityImpact} 
                    color={
                      diagnosis.disease.fertilityImpact === 'high' || diagnosis.disease.fertilityImpact === 'severe' 
                        ? 'error' 
                        : diagnosis.disease.fertilityImpact === 'moderate' 
                        ? 'warning' 
                        : 'success'
                    }
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {diagnosis.disease.description}
                </Typography>
                
                <FormControl fullWidth>
                  <FormLabel>Actividad Actual de la Enfermedad</FormLabel>
                  <RadioGroup
                    value={diagnosis.currentActivity.status}
                    onChange={(e) => updateDiseaseActivity(index, {
                      ...diagnosis.currentActivity,
                      status: e.target.value as ActivityStatus
                    })}
                    row
                  >
                    <FormControlLabel value="remission" control={<Radio />} label="Remisión" />
                    <FormControlLabel value="low" control={<Radio />} label="Baja" />
                    <FormControlLabel value="moderate" control={<Radio />} label="Moderada" />
                    <FormControlLabel value="high" control={<Radio />} label="Alta" />
                  </RadioGroup>
                </FormControl>
              </Paper>
            ))}

            {selectedDiseases.length === 0 && (
              <Alert severity="info">
                Seleccione al menos una enfermedad autoinmune para continuar
              </Alert>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              💊 Medicamentos Actuales
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Autocomplete
                options={AUTOIMMUNE_MEDICATIONS}
                getOptionLabel={(option) => `${option.name} (${option.genericName})`}
                renderInput={(params) => (
                  <TextField {...params} label="Buscar medicamento" />
                )}
                onChange={(_, value) => value && addMedication(value)}
              />
            </Box>

            {selectedMedications.map((patientMed, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Medication sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                    {patientMed.medication.name}
                  </Typography>
                  <Chip 
                    label={`Categoría ${patientMed.medication.pregnancyCategory}`}
                    color={
                      patientMed.medication.pregnancyCategory === 'A' || patientMed.medication.pregnancyCategory === 'B' 
                        ? 'success' 
                        : patientMed.medication.pregnancyCategory === 'C' 
                        ? 'warning' 
                        : 'error'
                    }
                    size="small"
                  />
                </Box>

                {patientMed.medication.teratogenicity.level !== 'none' && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Riesgo teratogénico:</strong> {patientMed.medication.teratogenicity.description}
                    </Typography>
                    {patientMed.medication.washoutPeriod && (
                      <Typography variant="body2">
                        <strong>Período de lavado:</strong> {patientMed.medication.washoutPeriod} días
                      </Typography>
                    )}
                  </Alert>
                )}

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Dosis"
                      value={patientMed.dose}
                      onChange={(e) => updateMedicationDetails(index, { dose: e.target.value })}
                      placeholder="ej: 15mg"
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth>
                      <FormLabel>Frecuencia</FormLabel>
                      <Select
                        value={patientMed.frequency}
                        onChange={(e) => updateMedicationDetails(index, { frequency: e.target.value })}
                      >
                        <MenuItem value="daily">Diario</MenuItem>
                        <MenuItem value="weekly">Semanal</MenuItem>
                        <MenuItem value="monthly">Mensual</MenuItem>
                        <MenuItem value="prn">Según necesidad</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        );

      case 3:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              🎯 Objetivos Reproductivos
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">Tiempo Deseado para Concepción</FormLabel>
                  <RadioGroup
                    value={reproductiveGoals.desiredTimeframe}
                    onChange={(e) => setReproductiveGoals(prev => ({ 
                      ...prev, 
                      desiredTimeframe: e.target.value as 'immediate' | '6months' | '1year' | '2years' | 'undecided'
                    }))}
                  >
                    <FormControlLabel value="immediate" control={<Radio />} label="Inmediato (próximos 3 meses)" />
                    <FormControlLabel value="6months" control={<Radio />} label="En 6 meses" />
                    <FormControlLabel value="1year" control={<Radio />} label="En 1 año" />
                    <FormControlLabel value="2years" control={<Radio />} label="En 2+ años" />
                    <FormControlLabel value="undecided" control={<Radio />} label="Sin decidir aún" />
                  </RadioGroup>
                </FormControl>
              </Box>

              <Box>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">Reproducción Asistida</FormLabel>
                  <RadioGroup
                    value={reproductiveGoals.assistedReproduction}
                    onChange={(e) => setReproductiveGoals(prev => ({ 
                      ...prev, 
                      assistedReproduction: e.target.value === 'true' 
                    }))}
                  >
                    <FormControlLabel value={false} control={<Radio />} label="Concepción natural" />
                    <FormControlLabel value={true} control={<Radio />} label="Considerando reproducción asistida" />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Box>
          </Box>
        );

      case 4:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              ✅ Revisión Final
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    👤 Información Básica
                  </Typography>
                  <Typography variant="body2">Edad: {basicInfo.age} años</Typography>
                  <Typography variant="body2">Embarazos previos: {basicInfo.previousPregnancies}</Typography>
                </Paper>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    🏥 Diagnósticos ({selectedDiseases.length})
                  </Typography>
                  {selectedDiseases.map((diag, i) => (
                    <Typography key={i} variant="body2">
                      • {diag.disease.name} ({diag.currentActivity.status})
                    </Typography>
                  ))}
                </Paper>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    💊 Medicamentos ({selectedMedications.length})
                  </Typography>
                  {selectedMedications.map((med, i) => (
                    <Typography key={i} variant="body2">
                      • {med.medication.name} {med.dose}
                    </Typography>
                  ))}
                </Paper>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    🎯 Objetivos Reproductivos
                  </Typography>
                  <Typography variant="body2">
                    Tiempo deseado: {reproductiveGoals.desiredTimeframe}
                  </Typography>
                  <Typography variant="body2">
                    Reproducción asistida: {reproductiveGoals.assistedReproduction ? 'Sí' : 'No'}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        );

      default:
        return 'Paso desconocido';
    }
  };

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 0: return basicInfo.age > 0;
      case 1: return selectedDiseases.length > 0;
      case 2: return true; // Medicamentos son opcionales
      case 3: return reproductiveGoals.desiredTimeframe !== undefined && reproductiveGoals.desiredTimeframe !== null;
      case 4: return true;
      default: return false;
    }
  };

  if (isComplete) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom color="success.main">
            ✅ Evaluación Completada
          </Typography>
          <Typography variant="body1" color="text.secondary">
            La evaluación autoinmune ha sido registrada exitosamente.
            Ahora puede revisar los resultados en el dashboard.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Assignment sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h5" color="primary">
            Evaluación de Enfermedades Autoinmunes y Fertilidad
          </Typography>
        </Box>

        <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
          {ASSESSMENT_STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <LinearProgress 
          variant="determinate" 
          value={(currentStep / (ASSESSMENT_STEPS.length - 1)) * 100} 
          sx={{ mb: 2 }}
        />

        {getStepContent(currentStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={currentStep === 0}
            onClick={handleBack}
          >
            Atrás
          </Button>
          
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepComplete(currentStep)}
          >
            {currentStep === ASSESSMENT_STEPS.length - 1 ? 'Completar Evaluación' : 'Siguiente'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
