import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  SelfImprovement,
  Timer,
  Favorite,
  Visibility
} from '@mui/icons-material';

interface MindfulnessExercise {
  id: string;
  title: string;
  description: string;
  duration: number; // en minutos
  type: 'respiracion' | 'body_scan' | 'visualizacion' | 'meditacion';
  instructions: string[];
  benefits: string[];
}

interface MindfulnessExercisesProps {
  onComplete: (exerciseId: string, duration: number) => void;
}

const EXERCISES: MindfulnessExercise[] = [
  {
    id: 'respiracion_4_7_8',
    title: 'Respiración 4-7-8',
    description: 'Técnica de respiración para reducir ansiedad y estrés',
    duration: 5,
    type: 'respiracion',
    instructions: [
      'Siéntate cómodamente con la espalda recta',
      'Exhala completamente por la boca',
      'Inhala por la nariz contando hasta 4',
      'Mantén la respiración contando hasta 7',
      'Exhala por la boca contando hasta 8',
      'Repite el ciclo 4 veces'
    ],
    benefits: [
      'Reduce la ansiedad',
      'Mejora la calidad del sueño',
      'Disminuye el estrés',
      'Regula el sistema nervioso'
    ]
  },
  {
    id: 'body_scan',
    title: 'Exploración Corporal',
    description: 'Escaneo mental del cuerpo para liberar tensiones',
    duration: 10,
    type: 'body_scan',
    instructions: [
      'Acuéstate cómodamente boca arriba',
      'Cierra los ojos y respira naturalmente',
      'Enfoca tu atención en los dedos de los pies',
      'Mueve lentamente tu atención hacia arriba',
      'Observa cada parte del cuerpo sin juzgar',
      'Libera cualquier tensión que encuentres',
      'Termina enfocándote en todo el cuerpo como un conjunto'
    ],
    benefits: [
      'Libera tensión muscular',
      'Mejora la conciencia corporal',
      'Promueve la relajación profunda',
      'Reduce el dolor crónico'
    ]
  },
  {
    id: 'visualizacion_lugar_seguro',
    title: 'Lugar Seguro',
    description: 'Visualización de un espacio de calma y seguridad',
    duration: 8,
    type: 'visualizacion',
    instructions: [
      'Cierra los ojos y respira profundamente',
      'Imagina un lugar donde te sientes completamente seguro',
      'Puede ser real o imaginario',
      'Observa todos los detalles: colores, sonidos, texturas',
      'Siente la paz y seguridad de este lugar',
      'Permanece aquí todo el tiempo que necesites',
      'Recuerda que puedes volver cuando quieras'
    ],
    benefits: [
      'Crea sensación de seguridad',
      'Reduce ansiedad anticipatoria',
      'Mejora el estado de ánimo',
      'Desarrolla recursos internos'
    ]
  },
  {
    id: 'meditacion_autocompasion',
    title: 'Meditación de Autocompasión',
    description: 'Práctica para cultivar amabilidad hacia uno mismo',
    duration: 12,
    type: 'meditacion',
    instructions: [
      'Siéntate cómodamente y cierra los ojos',
      'Piensa en una dificultad que estás enfrentando',
      'Coloca una mano en el corazón',
      'Reconoce: "Este es un momento de sufrimiento"',
      'Recuerda: "El sufrimiento es parte de la experiencia humana"',
      'Ofrécete bondad: "Que pueda ser amable conmigo mismo"',
      'Envía esta compasión a ti mismo durante varios minutos'
    ],
    benefits: [
      'Reduce autocrítica',
      'Mejora autoestima',
      'Aumenta resiliencia emocional',
      'Fomenta aceptación personal'
    ]
  }
];

export const MindfulnessExercises: React.FC<MindfulnessExercisesProps> = ({
  onComplete
}) => {
  const [selectedExercise, setSelectedExercise] = useState<MindfulnessExercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let interval: number;
    
    if (isPlaying && selectedExercise) {
      interval = window.setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          if (newTime >= selectedExercise.duration * 60) {
            setIsPlaying(false);
            onComplete(selectedExercise.id, selectedExercise.duration);
            return selectedExercise.duration * 60;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => window.clearInterval(interval);
  }, [isPlaying, selectedExercise, onComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getExerciseIcon = (type: string) => {
    switch (type) {
      case 'respiracion': return <Favorite color="error" />;
      case 'body_scan': return <SelfImprovement color="primary" />;
      case 'visualizacion': return <Visibility color="secondary" />;
      case 'meditacion': return <SelfImprovement color="success" />;
      default: return <SelfImprovement />;
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setTimeElapsed(0);
  };

  const handleSelectExercise = (exercise: MindfulnessExercise) => {
    setSelectedExercise(exercise);
    setTimeElapsed(0);
    setIsPlaying(false);
  };

  if (!selectedExercise) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
          🧘‍♀️ Ejercicios de Mindfulness
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          Estos ejercicios están diseñados para ayudarte a manejar el estrés y la ansiedad 
          relacionados con el proceso de fertilidad. Practica regularmente para mejores resultados.
        </Alert>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {EXERCISES.map((exercise) => (
            <Card 
              key={exercise.id} 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
              onClick={() => handleSelectExercise(exercise)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getExerciseIcon(exercise.type)}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {exercise.title}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {exercise.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Timer fontSize="small" />
                  <Typography variant="body2">
                    {exercise.duration} minutos
                  </Typography>
                  <Chip 
                    label={exercise.type.replace('_', ' ')}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Beneficios principales:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {exercise.benefits.slice(0, 2).map((benefit, index) => (
                    <Chip 
                      key={index}
                      label={benefit}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  const progress = (timeElapsed / (selectedExercise.duration * 60)) * 100;

  return (
    <Box>
      <Button 
        onClick={() => setSelectedExercise(null)} 
        sx={{ mb: 2 }}
      >
        ← Volver a ejercicios
      </Button>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            {getExerciseIcon(selectedExercise.type)}
            <Typography variant="h5" sx={{ ml: 1 }}>
              {selectedExercise.title}
            </Typography>
          </Box>

          <Typography variant="body1" paragraph>
            {selectedExercise.description}
          </Typography>

          {/* Timer y progreso */}
          <Card variant="outlined" sx={{ mb: 3, p: 2, textAlign: 'center' }}>
            <Typography variant="h3" color="primary">
              {formatTime(timeElapsed)} / {formatTime(selectedExercise.duration * 60)}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ mt: 1, height: 8, borderRadius: 4 }}
            />
          </Card>

          {/* Controles */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
            {!isPlaying ? (
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={handlePlay}
                size="large"
              >
                {timeElapsed > 0 ? 'Continuar' : 'Comenzar'}
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<Pause />}
                onClick={handlePause}
                size="large"
              >
                Pausar
              </Button>
            )}
            
            <Button
              variant="outlined"
              startIcon={<Stop />}
              onClick={handleStop}
            >
              Detener
            </Button>
          </Box>

          {/* Instrucciones */}
          <Typography variant="h6" gutterBottom>
            📝 Instrucciones
          </Typography>
          <List>
            {selectedExercise.instructions.map((instruction, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Typography variant="body2" color="primary" fontWeight="bold">
                    {index + 1}
                  </Typography>
                </ListItemIcon>
                <ListItemText primary={instruction} />
              </ListItem>
            ))}
          </List>

          {/* Beneficios */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            ✨ Beneficios
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedExercise.benefits.map((benefit, index) => (
              <Chip 
                key={index}
                label={benefit}
                color="success"
                variant="outlined"
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
