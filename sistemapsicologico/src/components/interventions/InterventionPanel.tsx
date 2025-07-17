import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  ExpandMore,
  Psychology,
  Group,
  SelfImprovement,
  LocalPharmacy,
  School,
  Emergency,
  PlayArrow,
  CheckCircle
} from '@mui/icons-material';
import type { InterventionRecommendation, InterventionResource } from '../../types/psychological';

interface InterventionPanelProps {
  interventions: InterventionRecommendation[];
  onStartIntervention: (intervention: InterventionRecommendation) => void;
  onCompleteIntervention: (interventionId: string) => void;
}

const getInterventionIcon = (type: string) => {
  switch (type) {
    case 'psicoeducacion': return <School color="primary" />;
    case 'terapia_individual': return <Psychology color="secondary" />;
    case 'terapia_pareja': return <Group color="info" />;
    case 'psicofarmacologia': return <LocalPharmacy color="warning" />;
    case 'grupos_apoyo': return <Group color="success" />;
    case 'mindfulness': return <SelfImprovement color="info" />;
    case 'derivacion_urgente': return <Emergency color="error" />;
    default: return <Psychology />;
  }
};

const getInterventionColor = (priority: string) => {
  switch (priority) {
    case 'alta': return 'error' as const;
    case 'media': return 'warning' as const;
    case 'baja': return 'success' as const;
    default: return 'default' as const;
  }
};

const getInterventionTitle = (type: string): string => {
  switch (type) {
    case 'psicoeducacion': return 'Psicoeducación';
    case 'terapia_individual': return 'Terapia Individual';
    case 'terapia_pareja': return 'Terapia de Pareja';
    case 'psicofarmacologia': return 'Evaluación Psicofarmacológica';
    case 'grupos_apoyo': return 'Grupos de Apoyo';
    case 'mindfulness': return 'Mindfulness y Relajación';
    case 'derivacion_urgente': return 'Derivación Urgente';
    default: return 'Intervención';
  }
};

export const InterventionPanel: React.FC<InterventionPanelProps> = ({
  interventions,
  onStartIntervention,
  onCompleteIntervention
}) => {
  const [selectedResource, setSelectedResource] = useState<InterventionResource | null>(null);
  const [completedInterventions, setCompletedInterventions] = useState<Set<string>>(new Set());

  const handleStartIntervention = (intervention: InterventionRecommendation) => {
    onStartIntervention(intervention);
  };

  const handleCompleteIntervention = (interventionType: string) => {
    setCompletedInterventions(prev => new Set(prev.add(interventionType)));
    onCompleteIntervention(interventionType);
  };

  const handleResourceClick = (resource: InterventionResource) => {
    if (resource.url) {
      window.open(resource.url, '_blank');
    } else {
      setSelectedResource(resource);
    }
  };

  const ResourceDialog = () => (
    <Dialog 
      open={!!selectedResource} 
      onClose={() => setSelectedResource(null)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {selectedResource?.title}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          {selectedResource?.description}
        </Typography>
        
        {selectedResource?.type === 'ejercicio' && (
          <Alert severity="info" sx={{ mt: 2 }}>
            💡 Este es un ejercicio práctico. Dedica al menos 10-15 minutos para completarlo.
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSelectedResource(null)}>
          Cerrar
        </Button>
        <Button 
          variant="contained" 
          onClick={() => setSelectedResource(null)}
        >
          Completado
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (interventions.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🎯 Intervenciones Recomendadas
          </Typography>
          <Alert severity="success">
            ¡Excelente! No se requieren intervenciones específicas en este momento.
            Continúa con tu rutina de autocuidado.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Ordenar por prioridad
  const sortedInterventions = [...interventions].sort((a, b) => {
    const priorityOrder = { 'alta': 3, 'media': 2, 'baja': 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
        🎯 Plan de Intervenciones Psicológicas
      </Typography>

      {sortedInterventions.map((intervention, index) => {
        const isCompleted = completedInterventions.has(intervention.type);
        
        return (
          <Accordion key={`intervention-${intervention.type}-${index}`} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ mr: 2 }}>
                  {getInterventionIcon(intervention.type)}
                </Box>
                
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">
                    {getInterventionTitle(intervention.type)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {intervention.description}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip
                    label={`Prioridad ${intervention.priority.toUpperCase()}`}
                    color={getInterventionColor(intervention.priority)}
                    size="small"
                  />
                  {isCompleted && (
                    <CheckCircle color="success" />
                  )}
                </Box>
              </Box>
            </AccordionSummary>
            
            <AccordionDetails>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  📅 Duración Estimada: {intervention.estimatedDuration}
                </Typography>
                
                {intervention.type === 'derivacion_urgente' && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    ⚠️ Esta intervención requiere atención inmediata. 
                    Contacta con un profesional de la salud mental lo antes posible.
                  </Alert>
                )}
              </Box>

              {intervention.resources.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    📚 Recursos Disponibles
                  </Typography>
                  
                  <List>
                    {intervention.resources.map((resource, resourceIndex) => (
                      <ListItem 
                        key={`resource-${resourceIndex}-${intervention.type}`}
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: 'action.hover' },
                          borderRadius: 1,
                          mb: 1
                        }}
                        onClick={() => handleResourceClick(resource)}
                      >
                        <ListItemIcon>
                          {resource.type === 'articulo' && <School />}
                          {resource.type === 'video' && <PlayArrow />}
                          {resource.type === 'ejercicio' && <SelfImprovement />}
                          {resource.type === 'app' && <Psychology />}
                          {resource.type === 'contacto_profesional' && <Emergency />}
                        </ListItemIcon>
                        <ListItemText
                          primary={resource.title}
                          secondary={`${resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} - ${resource.description}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                {!isCompleted ? (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<PlayArrow />}
                      onClick={() => handleStartIntervention(intervention)}
                      color={intervention.priority === 'alta' ? 'error' : 'primary'}
                    >
                      Iniciar Intervención
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<CheckCircle />}
                      onClick={() => handleCompleteIntervention(intervention.type)}
                    >
                      Marcar como Completada
                    </Button>
                  </>
                ) : (
                  <Chip
                    icon={<CheckCircle />}
                    label="Intervención Completada"
                    color="success"
                    variant="outlined"
                  />
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}

      <ResourceDialog />
      
      {/* Resumen */}
      <Card sx={{ mt: 3, backgroundColor: 'background.paper' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 Resumen del Plan
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Chip 
              label={`${interventions.length} Intervenciones Totales`}
              color="primary"
            />
            <Chip 
              label={`${interventions.filter(i => i.priority === 'alta').length} Alta Prioridad`}
              color="error"
            />
            <Chip 
              label={`${completedInterventions.size} Completadas`}
              color="success"
            />
          </Box>
          
          <Alert severity="info">
            💡 <strong>Recomendación:</strong> Comienza por las intervenciones de alta prioridad. 
            Dedica tiempo diario a las prácticas recomendadas para obtener mejores resultados.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};
