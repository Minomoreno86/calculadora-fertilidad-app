import type { 
  PsychologicalProfile,
  InterventionRecommendation,
  InterventionResource 
} from '../types/psychological';

/**
 * 🎯 SERVICIO DE RECOMENDACIONES INTELIGENTES
 * Genera recomendaciones personalizadas basadas en perfil psicológico
 */
export class RecommendationService {
  
  /**
   * Genera recomendaciones de intervención personalizadas
   */
  static generateInterventions(profile: PsychologicalProfile): InterventionRecommendation[] {
    const interventions: InterventionRecommendation[] = [];

    // Evaluación de riesgo de depresión
    const depressionAssessment = profile.assessments.depression;
    if (depressionAssessment && (depressionAssessment.depressionLevel === 'moderada_severa' || depressionAssessment.depressionLevel === 'severa')) {
      interventions.push({
        type: 'terapia_individual',
        priority: depressionAssessment.depressionLevel === 'severa' ? 'alta' : 'media',
        description: 'Terapia psicológica individual especializada en fertilidad y depresión',
        resources: this.getDepressionResources(),
        estimatedDuration: '8-12 sesiones semanales'
      });

      if (depressionAssessment.depressionLevel === 'severa') {
        interventions.push({
          type: 'derivacion_urgente',
          priority: 'alta',
          description: 'Evaluación psiquiátrica urgente por riesgo alto de depresión',
          resources: this.getUrgentResources(),
          estimatedDuration: 'Inmediato'
        });
      }
    }

    // Evaluación de estrés
    const stressAssessment = profile.assessments.stress;
    if (stressAssessment && stressAssessment.riskLevel === 'alto') {
      interventions.push({
        type: 'mindfulness',
        priority: 'media',
        description: 'Técnicas de mindfulness y reducción de estrés basadas en atención plena',
        resources: this.getMindfulnessResources(),
        estimatedDuration: '4-6 semanas de práctica diaria'
      });

      interventions.push({
        type: 'psicoeducacion',
        priority: 'media',
        description: 'Educación sobre manejo del estrés en procesos de fertilidad',
        resources: this.getStressEducationResources(),
        estimatedDuration: '2-3 sesiones'
      });
    }

    // Problemas de pareja
    const relationshipAssessment = profile.assessments.relationship;
    if (relationshipAssessment && relationshipAssessment.totalScore < 70) {
      interventions.push({
        type: 'terapia_pareja',
        priority: 'media',
        description: 'Terapia de pareja especializada en fertilidad',
        resources: this.getCoupleTherapyResources(),
        estimatedDuration: '8-10 sesiones quincenales'
      });
    }

    // Apoyo social bajo
    const socialSupportAssessment = profile.assessments.socialSupport;
    if (socialSupportAssessment && socialSupportAssessment.totalScore < 50) {
      interventions.push({
        type: 'grupos_apoyo',
        priority: 'baja',
        description: 'Participación en grupos de apoyo para personas con problemas de fertilidad',
        resources: this.getSupportGroupResources(),
        estimatedDuration: 'Participación continua'
      });
    }

    // Psicoeducación general
    interventions.push({
      type: 'psicoeducacion',
      priority: 'baja',
      description: 'Educación general sobre aspectos psicológicos de la fertilidad',
      resources: this.getGeneralEducationResources(),
      estimatedDuration: '1-2 sesiones'
    });

    return interventions.sort((a, b) => {
      const priorityOrder = { 'alta': 3, 'media': 2, 'baja': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Genera recomendaciones de autocuidado diario
   */
  static generateDailyCareRecommendations(profile: PsychologicalProfile): string[] {
    const recommendations: string[] = [];

    // Basadas en nivel de estrés
    const stressAssessment = profile.assessments.stress;
    if (stressAssessment && stressAssessment.riskLevel === 'alto') {
      recommendations.push(
        'Practica 10 minutos de respiración profunda al despertar',
        'Realiza ejercicio suave (caminar, yoga) por 20-30 minutos',
        'Limita el tiempo de búsqueda de información sobre fertilidad a 30 minutos diarios'
      );
    }

    // Basadas en calidad del sueño - usando calidad de vida general
    const qolAssessment = profile.assessments.qualityOfLife;
    if (qolAssessment && qolAssessment.totalScore < 60) {
      recommendations.push(
        'Establece una rutina de sueño constante',
        'Evita dispositivos electrónicos 1 hora antes de dormir',
        'Practica relajación muscular progresiva antes de acostarte'
      );
    }

    // Recomendaciones generales
    recommendations.push(
      'Mantén un diario de emociones y gratitud',
      'Dedica tiempo a actividades placenteras no relacionadas con fertilidad',
      'Comunícate abiertamente con tu pareja sobre sentimientos y preocupaciones'
    );

    return recommendations;
  }

  /**
   * Genera alertas personalizadas
   */
  static generateAlerts(profile: PsychologicalProfile): Array<{
    type: 'info' | 'warning' | 'danger';
    message: string;
    actions?: string[];
  }> {
    const alerts: Array<{
      type: 'info' | 'warning' | 'danger';
      message: string;
      actions?: string[];
    }> = [];

    // Alertas críticas
    const depressionAssessment = profile.assessments.depression;
    if (depressionAssessment && depressionAssessment.depressionLevel === 'severa') {
      alerts.push({
        type: 'danger',
        message: 'Riesgo crítico de depresión detectado. Se recomienda evaluación profesional inmediata.',
        actions: ['Buscar ayuda profesional', 'Contactar línea de crisis']
      });
    }

    // Alertas de advertencia
    const stressAssessment = profile.assessments.stress;
    if (stressAssessment && stressAssessment.riskLevel === 'alto') {
      alerts.push({
        type: 'warning',
        message: 'Nivel de estrés elevado. Considera implementar técnicas de manejo del estrés.',
        actions: ['Practicar mindfulness', 'Realizar ejercicio']
      });
    }

    const relationshipAssessment = profile.assessments.relationship;
    if (relationshipAssessment && relationshipAssessment.totalScore < 50) {
      alerts.push({
        type: 'warning',
        message: 'La calidad de la relación puede estar afectando tu bienestar emocional.',
        actions: ['Comunicación en pareja', 'Considerar terapia de pareja']
      });
    }

    // Alertas informativas
    const socialSupportAssessment = profile.assessments.socialSupport;
    if (socialSupportAssessment && socialSupportAssessment.totalScore < 60) {
      alerts.push({
        type: 'info',
        message: 'Fortalecer tu red de apoyo puede mejorar tu bienestar emocional.',
        actions: ['Unirse a grupos de apoyo', 'Conectar con familiares y amigos']
      });
    }

    return alerts;
  }

  /**
   * Sugiere próximos pasos en el tratamiento psicológico
   */
  static suggestNextSteps(
    profile: PsychologicalProfile,
    completedInterventions: string[]
  ): string[] {
    const nextSteps: string[] = [];

    // Si completó mindfulness, sugerir profundización
    if (completedInterventions.includes('mindfulness')) {
      nextSteps.push('Explorar técnicas avanzadas de meditación');
      nextSteps.push('Considerar curso intensivo de MBSR (Mindfulness-Based Stress Reduction)');
    }

    // Si completó psicoeducación básica
    if (completedInterventions.includes('psicoeducacion')) {
      nextSteps.push('Profundizar en técnicas específicas de afrontamiento');
      nextSteps.push('Explorar recursos de autoayuda especializados');
    }

    // Si mejoró significativamente
    const stressAssessment = profile.assessments.stress;
    const depressionAssessment = profile.assessments.depression;
    if (stressAssessment && depressionAssessment && 
        stressAssessment.riskLevel === 'bajo' && depressionAssessment.depressionLevel === 'ninguna') {
      nextSteps.push('Mantener rutinas de autocuidado establecidas');
      nextSteps.push('Considerar ser mentor para otras personas en situación similar');
      nextSteps.push('Realizar evaluaciones periódicas de mantenimiento');
    }

    // Si persisten dificultades
    if (completedInterventions.length > 3 && stressAssessment && stressAssessment.riskLevel === 'alto') {
      nextSteps.push('Evaluar necesidad de intervención más intensiva');
      nextSteps.push('Considerar factores externos que puedan estar manteniendo el estrés');
      nextSteps.push('Explorar opciones de tratamiento farmacológico adjuvante');
    }

    return nextSteps;
  }

  // MÉTODOS PRIVADOS PARA RECURSOS

  private static getDepressionResources(): InterventionResource[] {
    return [
      {
        type: 'contacto_profesional',
        title: 'Directorio de Psicólogos Especializados en Fertilidad',
        description: 'Lista de profesionales con experiencia en salud mental reproductiva',
        url: '/recursos/psicologos-fertilidad'
      },
      {
        type: 'articulo',
        title: 'Comprendiendo la Depresión en Procesos de Fertilidad',
        description: 'Guía informativa sobre la relación entre fertilidad y depresión',
        url: '/recursos/depresion-fertilidad'
      },
      {
        type: 'app',
        title: 'App de Seguimiento del Estado de Ánimo',
        description: 'Herramienta para monitorear diariamente tu bienestar emocional',
        url: '/recursos/app-mood-tracker'
      }
    ];
  }

  private static getUrgentResources(): InterventionResource[] {
    return [
      {
        type: 'contacto_profesional',
        title: 'Línea de Crisis 24/7',
        description: 'Apoyo inmediato en situaciones de crisis emocional',
        url: 'tel:+1-800-273-8255'
      },
      {
        type: 'contacto_profesional',
        title: 'Urgencias Psiquiátricas',
        description: 'Centros de atención inmediata para crisis de salud mental',
        url: '/recursos/urgencias-psiquiatricas'
      }
    ];
  }

  private static getMindfulnessResources(): InterventionResource[] {
    return [
      {
        type: 'ejercicio',
        title: 'Ejercicios de Respiración Guiada',
        description: 'Técnicas paso a paso para reducir ansiedad y estrés'
      },
      {
        type: 'video',
        title: 'Meditaciones Guiadas para Fertilidad',
        description: 'Videos de meditación específicamente diseñados para el proceso de fertilidad',
        url: '/recursos/meditaciones-fertilidad'
      },
      {
        type: 'app',
        title: 'Aplicación de Mindfulness',
        description: 'App con ejercicios diarios de atención plena',
        url: '/recursos/app-mindfulness'
      }
    ];
  }

  private static getStressEducationResources(): InterventionResource[] {
    return [
      {
        type: 'articulo',
        title: 'El Impacto del Estrés en la Fertilidad',
        description: 'Información científica sobre la relación estrés-fertilidad',
        url: '/recursos/estres-fertilidad'
      },
      {
        type: 'ejercicio',
        title: 'Técnicas de Manejo del Estrés',
        description: 'Estrategias prácticas para reducir el estrés diario'
      }
    ];
  }

  private static getCoupleTherapyResources(): InterventionResource[] {
    return [
      {
        type: 'contacto_profesional',
        title: 'Terapeutas de Pareja Especializados',
        description: 'Profesionales con experiencia en terapia de pareja y fertilidad',
        url: '/recursos/terapeutas-pareja'
      },
      {
        type: 'ejercicio',
        title: 'Ejercicios de Comunicación en Pareja',
        description: 'Actividades para mejorar la comunicación sobre fertilidad'
      }
    ];
  }

  private static getSupportGroupResources(): InterventionResource[] {
    return [
      {
        type: 'contacto_profesional',
        title: 'Grupos de Apoyo Locales',
        description: 'Encuentros presenciales con otras personas en situación similar',
        url: '/recursos/grupos-apoyo-locales'
      },
      {
        type: 'contacto_profesional',
        title: 'Comunidades Online de Apoyo',
        description: 'Foros y grupos virtuales de apoyo mutuo',
        url: '/recursos/comunidades-online'
      }
    ];
  }

  private static getGeneralEducationResources(): InterventionResource[] {
    return [
      {
        type: 'articulo',
        title: 'Guía Completa: Aspectos Psicológicos de la Fertilidad',
        description: 'Información integral sobre salud mental en procesos reproductivos',
        url: '/recursos/guia-psicologia-fertilidad'
      },
      {
        type: 'video',
        title: 'Webinar: Cuidando tu Salud Mental durante el Tratamiento',
        description: 'Conferencia online sobre bienestar emocional en fertilidad',
        url: '/recursos/webinar-salud-mental'
      }
    ];
  }
}
