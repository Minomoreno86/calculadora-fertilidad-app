import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  LinearProgress,
  Alert,
  Chip
} from '@mui/material';
import type { PSS10Assessment, PSS10Response } from '../../types/psychological';
import type { RiskLevel, ScoreResult } from '../../types/common';

interface PSS10ComponentProps {
  onComplete: (assessment: PSS10Assessment) => void;
  patientId: string;
}

const PSS10_QUESTIONS = [
  {
    id: 1,
    text: "En el último mes, ¿con qué frecuencia te has sentido alterado/a por algo que ocurrió inesperadamente relacionado con tu fertilidad?",
    reverse: false
  },
  {
    id: 2,
    text: "En el último mes, ¿con qué frecuencia te has sentido incapaz de controlar las cosas importantes relacionadas con tu tratamiento de fertilidad?",
    reverse: false
  },
  {
    id: 3,
    text: "En el último mes, ¿con qué frecuencia te has sentido nervioso/a o estresado/a por tu situación reproductiva?",
    reverse: false
  },
  {
    id: 4,
    text: "En el último mes, ¿con qué frecuencia has manejado con éxito los problemas irritantes relacionados con tu fertilidad?",
    reverse: true
  },
  {
    id: 5,
    text: "En el último mes, ¿con qué frecuencia has sentido que estás afrontando efectivamente los cambios importantes en tu vida reproductiva?",
    reverse: true
  },
  {
    id: 6,
    text: "En el último mes, ¿con qué frecuencia te has sentido seguro/a sobre tu capacidad para manejar tus problemas de fertilidad?",
    reverse: true
  },
  {
    id: 7,
    text: "En el último mes, ¿con qué frecuencia has sentido que las cosas van como tú quieres en tu búsqueda de embarazo?",
    reverse: true
  },
  {
    id: 8,
    text: "En el último mes, ¿con qué frecuencia te has dado cuenta de que no puedes afrontar todas las cosas relacionadas con tu fertilidad que tienes que hacer?",
    reverse: false
  },
  {
    id: 9,
    text: "En el último mes, ¿con qué frecuencia has podido controlar las dificultades emocionales relacionadas con tu infertilidad?",
    reverse: true
  },
  {
    id: 10,
    text: "En el último mes, ¿con qué frecuencia te has sentido que tienes todo bajo control en tu proceso reproductivo?",
    reverse: true
  }
];

const RESPONSE_OPTIONS = [
  { value: 0, label: "Nunca" },
  { value: 1, label: "Casi nunca" },
  { value: 2, label: "A veces" },
  { value: 3, label: "Frecuentemente" },
  { value: 4, label: "Muy frecuentemente" }
];

export const PSS10Component: React.FC<PSS10ComponentProps> = ({ onComplete, patientId }) => {
  const [responses, setResponses] = useState<{ [key: number]: number }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleResponseChange = (questionId: number, value: number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < PSS10_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeAssessment();
    }
  };

  const handlePrevious = () => {
    setCurrentQuestion(prev => Math.max(0, prev - 1));
  };

  const calculateScore = (): ScoreResult => {
    let total = 0;
    
    PSS10_QUESTIONS.forEach(question => {
      const response = responses[question.id] || 0;
      if (question.reverse) {
        total += 4 - response; // Invertir puntuación para preguntas positivas
      } else {
        total += response;
      }
    });

    let riskLevel: 'bajo' | 'moderado' | 'alto';
    if (total <= 13) {
      riskLevel = 'bajo';
    } else if (total <= 26) {
      riskLevel = 'moderado';
    } else {
      riskLevel = 'alto';
    }

    return { total, riskLevel };
  };

  const generateRecommendations = (riskLevel: 'bajo' | 'moderado' | 'alto'): string[] => {
    switch (riskLevel) {
      case 'bajo':
        return [
          'Mantén estrategias de afrontamiento actuales',
          'Continúa con actividades de autocuidado',
          'Practica técnicas de relajación preventivas'
        ];
      case 'moderado':
        return [
          'Considera técnicas de mindfulness específicas para fertilidad',
          'Evalúa fuentes de estrés y estrategias de manejo',
          'Busca apoyo adicional de pareja, familia o grupo de apoyo',
          'Practica ejercicios de respiración diarios'
        ];
      case 'alto':
        return [
          'RECOMENDACIÓN URGENTE: Consulta con psicólogo especialista en fertilidad',
          'Considera retrasar tratamientos hasta estabilizar estrés',
          'Implementa técnicas de reducción de estrés inmediatamente',
          'Evalúa apoyo psicofarmacológico si es necesario',
          'Aumenta frecuencia de autocuidado y actividades relajantes'
        ];
    }
  };

  const completeAssessment = () => {
    const { total, riskLevel } = calculateScore();
    const recommendations = generateRecommendations(riskLevel);

    const pss10Responses: PSS10Response[] = PSS10_QUESTIONS.map(question => ({
      questionId: question.id,
      question: question.text,
      response: responses[question.id] as 0 | 1 | 2 | 3 | 4
    }));

    const assessment: PSS10Assessment = {
      id: `pss10_${Date.now()}`,
      patientId,
      timestamp: new Date(),
      responses: pss10Responses,
      totalScore: total,
      riskLevel,
      recommendations
    };

    setIsComplete(true);
    onComplete(assessment);
  };

  const progress = ((currentQuestion + 1) / PSS10_QUESTIONS.length) * 100;
  const currentQ = PSS10_QUESTIONS[currentQuestion];
  const isCurrentAnswered = responses[currentQ.id] !== undefined;
  const allAnswered = PSS10_QUESTIONS.every(q => responses[q.id] !== undefined);

  if (isComplete) {
    const { total, riskLevel } = calculateScore();
    
    const getChipColor = (level: RiskLevel) => {
      if (level === 'bajo') return 'success';
      if (level === 'moderado') return 'warning';
      return 'error';
    };
    
    const getAlertSeverity = (level: RiskLevel) => {
      if (level === 'bajo') return 'success';
      if (level === 'moderado') return 'warning';
      return 'error';
    };
    
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary">
            🧠 Evaluación PSS-10 Completada
          </Typography>
          
          <Box sx={{ my: 3 }}>
            <Typography variant="h6">
              Puntuación Total: {total}/40
            </Typography>
            <Chip 
              label={`Nivel de Estrés: ${riskLevel.toUpperCase()}`}
              color={getChipColor(riskLevel)}
              sx={{ mt: 1 }}
            />
          </Box>

          <Alert 
            severity={getAlertSeverity(riskLevel)}
            sx={{ mb: 2 }}
          >
            <Typography variant="body2">
              {riskLevel === 'bajo' && 'Tu nivel de estrés está en rango saludable. Continúa con tus estrategias actuales.'}
              {riskLevel === 'moderado' && 'Presentas estrés moderado. Se recomiendan técnicas de manejo de estrés.'}
              {riskLevel === 'alto' && 'Nivel de estrés elevado. Se recomienda consulta con especialista.'}
            </Typography>
          </Alert>

          <Typography variant="h6" gutterBottom>
            Recomendaciones Personalizadas:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {generateRecommendations(riskLevel).map((rec, index) => (
              <Typography component="li" key={`rec-${riskLevel}-${index}`} variant="body2" sx={{ mb: 1 }}>
                {rec}
              </Typography>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom color="primary">
          🧠 Escala de Estrés Percibido (PSS-10)
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Esta evaluación mide tu nivel de estrés relacionado con la fertilidad. 
          Responde con honestidad según tu experiencia del último mes.
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Pregunta {currentQuestion + 1} de {PSS10_QUESTIONS.length}
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
        </Box>

        <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
          <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'medium' }}>
            {currentQ.text}
          </FormLabel>
          
          <RadioGroup
            value={responses[currentQ.id] || ''}
            onChange={(e) => handleResponseChange(currentQ.id, parseInt(e.target.value))}
          >
            {RESPONSE_OPTIONS.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
                sx={{ mb: 1 }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Anterior
          </Button>

          <Typography variant="body2" color="text.secondary">
            {Object.keys(responses).length}/{PSS10_QUESTIONS.length} respondidas
          </Typography>

          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isCurrentAnswered}
          >
            {currentQuestion === PSS10_QUESTIONS.length - 1 ? 'Finalizar' : 'Siguiente'}
          </Button>
        </Box>

        {currentQuestion === PSS10_QUESTIONS.length - 1 && allAnswered && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Has completado todas las preguntas. Haz clic en "Finalizar" para ver tus resultados.
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
