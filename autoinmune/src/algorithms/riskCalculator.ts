import type { 
  AutoimmunePatientProfile, 
  FertilityRiskAssessment, 
  FertilityImpactLevel,
  AssessedRiskFactor,
  ClinicalRecommendation,
  TimingWindow,
  MonitoringPlan
} from '../types/autoimmune';

export class AutoimmuneFertilityRiskCalculator {
  
  /**
   * Evaluación principal de riesgo de fertilidad
   */
  static assessFertilityRisk(patient: AutoimmunePatientProfile): FertilityRiskAssessment {
    const diseaseRiskFactors = this.assessDiseaseRelatedRisks(patient);
    const medicationRiskFactors = this.assessMedicationRelatedRisks(patient);
    const ageRiskFactors = this.assessAgeRelatedRisks(patient);
    const historyRiskFactors = this.assessHistoryRelatedRisks(patient);
    
    const allRiskFactors = [
      ...diseaseRiskFactors,
      ...medicationRiskFactors,
      ...ageRiskFactors,
      ...historyRiskFactors
    ];
    
    const overallRisk = this.calculateOverallRisk(allRiskFactors);
    const protectiveFactors = this.identifyProtectiveFactors(patient);
    const recommendations = this.generateRecommendations(patient, allRiskFactors);
    const timingWindow = this.assessOptimalTiming(patient, allRiskFactors);
    const monitoringPlan = this.createMonitoringPlan(patient, allRiskFactors);
    const conceptionProbability = this.estimateConceptionProbability(patient, overallRisk);
    
    return {
      overallRisk,
      riskFactors: allRiskFactors,
      protectiveFactors,
      recommendations,
      optimalTimingWindow: timingWindow,
      monitoringPlan,
      estimatedConceptionProbability: conceptionProbability
    };
  }
  
  /**
   * Evalúa riesgos relacionados con la enfermedad autoinmune
   */
  private static assessDiseaseRelatedRisks(patient: AutoimmunePatientProfile): AssessedRiskFactor[] {
    const risks: AssessedRiskFactor[] = [];
    
    patient.diagnoses.forEach(diagnosis => {
      const disease = diagnosis.disease;
      
      // Riesgo base de la enfermedad
      risks.push({
        category: 'disease',
        description: `${disease.name} - impacto en fertilidad`,
        impact: disease.fertilityImpact,
        modifiable: false,
        interventions: this.getDiseaseSpecificInterventions(disease.id)
      });
      
      // Riesgo por actividad de la enfermedad
      if (diagnosis.currentActivity.status !== 'remission') {
        risks.push({
          category: 'activity',
          description: `Actividad de enfermedad: ${diagnosis.currentActivity.status}`,
          impact: this.mapActivityToRisk(diagnosis.currentActivity.status),
          modifiable: true,
          interventions: ['Optimizar tratamiento', 'Control de actividad', 'Consulta especialista']
        });
      }
      
      // Riesgos por órganos afectados
      disease.affectedOrgans.forEach(organ => {
        if (organ === 'reproductive' || organ === 'endocrine') {
          risks.push({
            category: 'disease',
            description: `Compromiso ${organ}`,
            impact: 'moderate',
            modifiable: true,
            interventions: [`Evaluación ${organ}`, 'Monitoreo especializado']
          });
        }
      });
    });
    
    return risks;
  }
  
  /**
   * Evalúa riesgos relacionados con medicamentos
   */
  private static assessMedicationRelatedRisks(patient: AutoimmunePatientProfile): AssessedRiskFactor[] {
    const risks: AssessedRiskFactor[] = [];
    
    patient.currentMedications.forEach(patientMed => {
      const medication = patientMed.medication;
      
      // Riesgo teratogénico
      if (medication.teratogenicity.level !== 'none') {
        risks.push({
          category: 'medication',
          description: `${medication.name} - riesgo teratogénico ${medication.teratogenicity.level}`,
          impact: this.mapTeratogenicityToRisk(medication.teratogenicity.level),
          modifiable: true,
          interventions: [
            'Considerar alternativas seguras',
            'Planificación preconcepcional',
            `Washout period: ${medication.washoutPeriod || 0} días`
          ]
        });
      }
      
      // Riesgo para fertilidad
      const fertilityRisks = Object.entries(medication.fertilityRisk);
      fertilityRisks.forEach(([aspect, risk]) => {
        if (risk !== 'none') {
          risks.push({
            category: 'medication',
            description: `${medication.name} - impacto en ${aspect}`,
            impact: risk as FertilityImpactLevel,
            modifiable: true,
            interventions: [
              'Evaluación de alternativas',
              'Monitoreo de función reproductiva',
              'Optimización de dosis'
            ]
          });
        }
      });
    });
    
    return risks;
  }
  
  /**
   * Evalúa riesgos relacionados con la edad
   */
  private static assessAgeRelatedRisks(patient: AutoimmunePatientProfile): AssessedRiskFactor[] {
    const risks: AssessedRiskFactor[] = [];
    
    if (patient.age >= 35) {
      risks.push({
        category: 'age',
        description: `Edad materna avanzada (${patient.age} años)`,
        impact: patient.age >= 40 ? 'high' : 'moderate',
        modifiable: false,
        interventions: [
          'Evaluación de reserva ovárica',
          'Consejería genética',
          'Considerar reproducción asistida',
          'Priorizar timing óptimo'
        ]
      });
    }
    
    return risks;
  }
  
  /**
   * Evalúa riesgos basados en historia reproductiva
   */
  private static assessHistoryRelatedRisks(patient: AutoimmunePatientProfile): AssessedRiskFactor[] {
    const risks: AssessedRiskFactor[] = [];
    
    // Historia de pérdidas gestacionales
    const miscarriages = patient.fertilityGoals.previousPregnancies.filter(
      p => p.outcome === 'miscarriage'
    ).length;
    
    if (miscarriages >= 2) {
      risks.push({
        category: 'history',
        description: `Pérdida gestacional recurrente (${miscarriages} abortos)`,
        impact: 'high',
        modifiable: true,
        interventions: [
          'Estudio de pérdida gestacional recurrente',
          'Evaluación de síndrome antifosfolípido',
          'Screening trombofilias',
          'Optimización preconcepcional'
        ]
      });
    }
    
    // Complicaciones obstétricas previas
    const complications = patient.fertilityGoals.previousPregnancies
      .flatMap(p => p.complications)
      .filter(Boolean);
    
    if (complications.length > 0) {
      risks.push({
        category: 'history',
        description: 'Complicaciones obstétricas previas',
        impact: 'moderate',
        modifiable: true,
        interventions: [
          'Evaluación de riesgo obstétrico',
          'Planificación de embarazo de alto riesgo',
          'Equipo multidisciplinario'
        ]
      });
    }
    
    return risks;
  }
  
  /**
   * Calcula el riesgo global basado en todos los factores
   */
  private static calculateOverallRisk(riskFactors: AssessedRiskFactor[]): FertilityImpactLevel {
    const riskScores = {
      'low': 1,
      'moderate': 2,
      'high': 3,
      'severe': 4
    };
    
    const totalScore = riskFactors.reduce((sum, factor) => {
      return sum + riskScores[factor.impact];
    }, 0);
    
    const avgScore = totalScore / riskFactors.length;
    
    if (avgScore >= 3.5) return 'severe';
    if (avgScore >= 2.5) return 'high';
    if (avgScore >= 1.5) return 'moderate';
    return 'low';
  }
  
  /**
   * Identifica factores protectores
   */
  private static identifyProtectiveFactors(patient: AutoimmunePatientProfile) {
    const factors = [];
    
    // Edad joven
    if (patient.age < 30) {
      factors.push({
        factor: 'Edad reproductiva óptima',
        benefit: 'significant' as const,
        evidence: 'strong' as const
      });
    }
    
    // Enfermedad en remisión
    const inRemission = patient.diagnoses.every(d => d.currentActivity.status === 'remission');
    if (inRemission) {
      factors.push({
        factor: 'Enfermedad en remisión',
        benefit: 'significant' as const,
        evidence: 'strong' as const
      });
    }
    
    // Medicamentos seguros
    const safeMeds = patient.currentMedications.filter(med => 
      med.medication.pregnancyCategory === 'A' || med.medication.pregnancyCategory === 'B'
    );
    if (safeMeds.length > 0) {
      factors.push({
        factor: 'Medicamentos compatibles con embarazo',
        benefit: 'moderate' as const,
        evidence: 'strong' as const
      });
    }
    
    return factors;
  }
  
  /**
   * Genera recomendaciones clínicas personalizadas
   */
  private static generateRecommendations(
    patient: AutoimmunePatientProfile, 
    riskFactors: AssessedRiskFactor[]
  ): ClinicalRecommendation[] {
    const recommendations: ClinicalRecommendation[] = [];
    
    // Recomendaciones base preconcepcionales
    recommendations.push(
      {
        category: 'preconception',
        priority: 'high',
        recommendation: 'Ácido fólico 5mg/día (dosis alta por medicamentos)',
        evidence: 'rct',
        timeframe: '3 meses antes de concepción',
        specialist: 'Obstetra'
      },
      {
        category: 'preconception',
        priority: 'high',
        recommendation: 'Vitamina D 1000-2000 UI/día',
        evidence: 'observational',
        timeframe: 'Inmediato',
        specialist: 'Medicina general'
      },
      {
        category: 'monitoring',
        priority: 'high',
        recommendation: 'Evaluación de reserva ovárica (AMH, FSH, recuento folicular)',
        evidence: 'expert-opinion',
        timeframe: '6 meses',
        specialist: 'Reproducción asistida'
      }
    );
    
    // Recomendaciones específicas por medicamentos de riesgo
    const teratogenicMeds = riskFactors.filter(rf => 
      rf.category === 'medication' && rf.description.includes('teratogénico')
    );
    
    if (teratogenicMeds.length > 0) {
      recommendations.push({
        category: 'medication',
        priority: 'urgent',
        recommendation: 'Optimización de medicamentos preconcepcional',
        evidence: 'expert-opinion',
        timeframe: '3-6 meses antes de concepción',
        specialist: 'Reumatólogo/Especialista'
      });
    }
    
    // Recomendaciones por actividad de enfermedad
    const activeDisease = riskFactors.some(rf => 
      rf.category === 'activity' && rf.impact !== 'low'
    );
    
    if (activeDisease) {
      recommendations.push({
        category: 'specialist',
        priority: 'high',
        recommendation: 'Control estricto de actividad de enfermedad',
        evidence: 'observational',
        timeframe: '6 meses de estabilidad',
        specialist: 'Especialista en enfermedad'
      });
    }
    
    // Recomendaciones por edad
    if (patient.age >= 35) {
      recommendations.push({
        category: 'specialist',
        priority: 'medium',
        recommendation: 'Consejería genética',
        evidence: 'expert-opinion',
        timeframe: 'Preconcepcional',
        specialist: 'Genetista'
      });
    }
    
    return recommendations;
  }
  
  /**
   * Evalúa la ventana de tiempo óptima para concepción
   */
  private static assessOptimalTiming(
    patient: AutoimmunePatientProfile, 
    riskFactors: AssessedRiskFactor[]
  ): TimingWindow {
    const highRiskFactors = riskFactors.filter(rf => 
      rf.impact === 'high' || rf.impact === 'severe'
    );
    
    const medicationOptimizationNeeded = riskFactors.some(rf => 
      rf.category === 'medication' && rf.modifiable
    );
    
    const activeDisease = riskFactors.some(rf => 
      rf.category === 'activity'
    );
    
    // Determinar timing
    let suggestedTiming: TimingWindow['suggestedTiming'];
    let reasonForTiming: string;
    let conditions: string[] = [];
    
    if (highRiskFactors.length >= 3) {
      suggestedTiming = 'defer';
      reasonForTiming = 'Múltiples factores de alto riesgo requieren optimización';
      conditions = [
        'Control de actividad de enfermedad',
        'Optimización de medicamentos',
        'Evaluación especializada'
      ];
    } else if (medicationOptimizationNeeded || activeDisease) {
      suggestedTiming = '6months';
      reasonForTiming = 'Necesario optimizar tratamiento y controlar actividad';
      conditions = [
        'Estabilidad de enfermedad por 6 meses',
        'Medicamentos seguros establecidos'
      ];
    } else if (patient.age >= 40) {
      suggestedTiming = '3months';
      reasonForTiming = 'Edad materna avanzada, ventana de tiempo limitada';
      conditions = [
        'Evaluación rápida de reserva ovárica',
        'Optimización nutricional'
      ];
    } else {
      suggestedTiming = 'now';
      reasonForTiming = 'Condiciones favorables para concepción';
      conditions = [
        'Continuar monitoreo actual',
        'Suplementación preconcepcional'
      ];
    }
    
    return {
      optimal: suggestedTiming === 'now',
      currentRisk: this.calculateOverallRisk(riskFactors),
      suggestedTiming,
      reasonForTiming,
      conditions
    };
  }
  
  /**
   * Crea plan de monitoreo personalizado
   */
  private static createMonitoringPlan(
    patient: AutoimmunePatientProfile, 
    riskFactors: AssessedRiskFactor[]
  ): MonitoringPlan {
    const frequency = this.determineMonitoringFrequency(riskFactors);
    const tests = this.determineRequiredTests(patient, riskFactors);
    const specialists = this.determineRequiredSpecialists(patient);
    const redFlags = this.determineRedFlags(patient);
    
    return {
      frequency,
      tests,
      specialists,
      redFlags
    };
  }
  
  /**
   * Estima probabilidad de concepción
   */
  private static estimateConceptionProbability(
    patient: AutoimmunePatientProfile, 
    overallRisk: FertilityImpactLevel
  ): number {
    let baseProbability = 85; // Base para mujer sana
    
    // Ajuste por edad
    if (patient.age >= 35) baseProbability -= 20;
    if (patient.age >= 40) baseProbability -= 35;
    
    // Ajuste por riesgo global
    const riskAdjustments = {
      'low': -5,
      'moderate': -15,
      'high': -30,
      'severe': -50
    };
    
    baseProbability += riskAdjustments[overallRisk];
    
    // Ajuste por historia previa
    const successfulPregnancies = patient.fertilityGoals.previousPregnancies.filter(
      p => p.outcome === 'livebirth'
    ).length;
    
    if (successfulPregnancies > 0) baseProbability += 10;
    
    return Math.max(10, Math.min(95, baseProbability));
  }
  
  // Métodos auxiliares privados
  private static mapActivityToRisk(status: string): FertilityImpactLevel {
    const mapping: Record<string, FertilityImpactLevel> = {
      'low': 'low',
      'moderate': 'moderate',
      'high': 'high',
      'severe': 'severe',
      'remission': 'low'
    };
    return mapping[status] || 'moderate';
  }
  
  private static mapTeratogenicityToRisk(level: string): FertilityImpactLevel {
    const mapping: Record<string, FertilityImpactLevel> = {
      'low': 'low',
      'moderate': 'moderate',
      'major': 'severe',
      'none': 'low'
    };
    return mapping[level] || 'moderate';
  }
  
  private static getDiseaseSpecificInterventions(diseaseId: string): string[] {
    const interventions: Record<string, string[]> = {
      'sle': ['Control nefritis', 'Screening APS', 'Monitoreo cardiovascular'],
      'aps': ['Anticoagulación', 'Screening trombofilias', 'Monitoreo plaquetas'],
      'ra': ['Control articular', 'Screening cardiovascular', 'Evaluación pulmonar'],
      'hashimoto': ['Optimización TSH', 'Screening anticuerpos', 'Ajuste levotiroxina'],
      'dm1': ['HbA1c <6.5%', 'Screening retinopatía', 'Evaluación renal']
    };
    return interventions[diseaseId] || ['Monitoreo especializado'];
  }
  
  private static determineMonitoringFrequency(riskFactors: AssessedRiskFactor[]): MonitoringPlan['frequency'] {
    const highRiskCount = riskFactors.filter(rf => rf.impact === 'high' || rf.impact === 'severe').length;
    
    if (highRiskCount >= 3) return 'monthly';
    if (highRiskCount >= 1) return 'quarterly';
    return 'biannual';
  }
  
  private static determineRequiredTests(
    patient: AutoimmunePatientProfile, 
    _riskFactors: AssessedRiskFactor[]
  ) {
    const tests = [];
    
    // Tests base
    tests.push(
      {
        test: 'CBC con diferencial',
        frequency: 'trimestral',
        purpose: 'Monitoreo hematológico',
        urgentIf: ['Leucopenia <3000', 'Plaquetas <100000']
      },
      {
        test: 'Función renal',
        frequency: 'trimestral',
        purpose: 'Monitoreo renal',
        urgentIf: ['Creatinina elevada', 'Proteinuria']
      }
    );
    
    // Tests específicos por medicamentos
    const needsLFT = patient.currentMedications.some(med => 
      med.medication.monitoringRequired.includes('LFTs')
    );
    if (needsLFT) {
      tests.push({
        test: 'Función hepática',
        frequency: 'trimestral',
        purpose: 'Monitoreo hepatotoxicidad',
        urgentIf: ['ALT >3x normal', 'Bilirrubina elevada']
      });
    }
    
    return tests;
  }
  
  private static determineRequiredSpecialists(patient: AutoimmunePatientProfile): string[] {
    const specialists = ['Obstetra de alto riesgo'];
    
    patient.diagnoses.forEach(diagnosis => {
      const disease = diagnosis.disease;
      if (disease.category === 'systemic') specialists.push('Reumatólogo');
      if (disease.category === 'endocrine') specialists.push('Endocrinólogo');
      if (disease.category === 'hematological') specialists.push('Hematólogo');
    });
    
    return [...new Set(specialists)];
  }
  
  private static determineRedFlags(_patient: AutoimmunePatientProfile): string[] {
    return [
      'Sangrado vaginal anormal',
      'Dolor pélvico severo',
      'Fiebre persistente',
      'Síntomas de flare de enfermedad',
      'Efectos adversos medicamentos',
      'Síntomas de embarazo con test negativo'
    ];
  }
}
