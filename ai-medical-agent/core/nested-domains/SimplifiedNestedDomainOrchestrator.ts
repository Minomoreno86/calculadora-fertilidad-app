/**
 * 🧠 SIMPLIFIED NESTED DOMAIN ORCHESTRATOR V13.1
 * Versión simplificada del orquestador de dominios anidados
 * 
 * @description Sistema básico de clasificación de dominios médicos
 * @version 13.1.0 - Simplified Neural Evolution
 */

import { PATHOLOGIES_DATABASE } from '../knowledge-base/pathologies';
import {
  PatientProfile,
  DiagnosticResult,
  EvidenceLevel,
  PathologyAnalysis,
  TreatmentRecommendation
} from '../../types/MedicalTypes';

// ====================================================================
// 🧬 SIMPLIFIED TYPES FOR NESTED DOMAINS
// ====================================================================

export interface NestedDomainInsight {
  domain: string;
  insight: string;
  evidenceLevel: EvidenceLevel;
  clinicalRelevance: number;
  emergentPattern?: boolean;
}

export interface SimplifiedDomain {
  id: string;
  name: string;
  specialization: string;
  pathologies: string[];
  confidence: number;
}

export interface DomainClassificationResult {
  primaryDomain: SimplifiedDomain;
  secondaryDomains: SimplifiedDomain[];
  confidence: number;
  insights: NestedDomainInsight[];
}

// ====================================================================
// 🎯 SIMPLIFIED NESTED DOMAINS STRUCTURE
// ====================================================================

export const SIMPLIFIED_NESTED_DOMAINS: Record<string, SimplifiedDomain> = {
  femaleFactor: {
    id: 'female_factor',
    name: 'Factor Femenino de Infertilidad',
    specialization: 'Patologías reproductivas femeninas',
    pathologies: ['PCOS', 'endometriosis', 'ovulationDisorders', 'tubalFactor', 'advancedMaternalAge'],
    confidence: 0.95
  },
  
  maleFactor: {
    id: 'male_factor',
    name: 'Factor Masculino de Infertilidad',
    specialization: 'Patologías reproductivas masculinas',
    pathologies: ['maleInfertility', 'oligozoospermia', 'azoospermia'],
    confidence: 0.92
  },
  
  coupleFactor: {
    id: 'couple_factor',
    name: 'Factor de Pareja',
    specialization: 'Factores combinados e inexplicados',
    pathologies: ['unexplainedInfertility', 'immunologicalFactors'],
    confidence: 0.88
  },
  
  assistedReproduction: {
    id: 'assisted_reproduction',
    name: 'Técnicas de Reproducción Asistida',
    specialization: 'Protocolos y técnicas ART',
    pathologies: ['recurrentImplantationFailure', 'poorEmbryoQuality'],
    confidence: 0.90
  }
};

// ====================================================================
// 🧠 SIMPLIFIED NESTED DOMAIN ORCHESTRATOR
// ====================================================================

export class SimplifiedNestedDomainOrchestrator {
  private readonly domainDatabase: Record<string, SimplifiedDomain>;

  constructor() {
    this.domainDatabase = SIMPLIFIED_NESTED_DOMAINS;
  }

  /**
   * 🎯 SIMPLIFIED DOMAIN CLASSIFICATION
   */
  public async classifyDomain(
    symptoms: string[],
    patientProfile: PatientProfile
  ): Promise<DomainClassificationResult> {
    
    // Simple keyword-based classification
    const domainScores = this.calculateDomainScores(symptoms, patientProfile);
    
    // Sort domains by score
    const sortedDomains = Object.values(this.domainDatabase)
      .map(domain => ({
        ...domain,
        score: domainScores[domain.id] || 0
      }))
      .sort((a, b) => b.score - a.score);
    
    const primaryDomain = sortedDomains[0];
    const secondaryDomains = sortedDomains.slice(1, 3).filter(d => d.score > 0.3);
    
    // Generate basic insights
    const insights = this.generateBasicInsights(primaryDomain, symptoms);
    
    return {
      primaryDomain,
      secondaryDomains,
      confidence: primaryDomain.score,
      insights
    };
  }

  /**
   * 🔬 ENHANCED PATHOLOGY ANALYSIS WITH DOMAINS
   */
  public async analyzeWithDomains(
    symptoms: string[],
    patientProfile: PatientProfile
  ): Promise<PathologyAnalysis & { domainInsights: NestedDomainInsight[] }> {
    
    // 1. Classify domain
    const domainResult = await this.classifyDomain(symptoms, patientProfile);
    
    // 2. Get domain-specific pathologies
    const relevantPathologies = this.getRelevantPathologies(domainResult.primaryDomain);
    
    // 3. Create basic analysis
    const analysis = this.createDomainAnalysis(
      symptoms,
      patientProfile,
      domainResult,
      relevantPathologies
    );
    
    return {
      ...analysis,
      domainInsights: domainResult.insights
    };
  }

  /**
   * 💊 DOMAIN-AWARE TREATMENT RECOMMENDATIONS
   */
  public async generateDomainTreatments(
    diagnosis: DiagnosticResult,
    domainResult: DomainClassificationResult
  ): Promise<TreatmentRecommendation[]> {
    
    const treatments: TreatmentRecommendation[] = [];
    
    // Basic treatment mapping based on domain
    switch (domainResult.primaryDomain.id) {
      case 'female_factor':
        treatments.push(this.createTreatmentRecommendation(
          'Estimulación Ovárica',
          'Tratamiento hormonal para inducir ovulación',
          0.75
        ));
        break;
        
      case 'male_factor':
        treatments.push(this.createTreatmentRecommendation(
          'ICSI',
          'Inyección intracitoplasmática de espermatozoides',
          0.80
        ));
        break;
        
      case 'couple_factor':
        treatments.push(this.createTreatmentRecommendation(
          'IUI',
          'Inseminación intrauterina',
          0.70
        ));
        break;
        
      default:
        treatments.push(this.createTreatmentRecommendation(
          'Evaluación Integral',
          'Estudio completo de fertilidad',
          0.85
        ));
    }
    
    return treatments;
  }

  // ====================================================================
  // 🔧 PRIVATE HELPER METHODS
  // ====================================================================

  private calculateDomainScores(
    symptoms: string[],
    patientProfile: PatientProfile
  ): Record<string, number> {
    const scores: Record<string, number> = {};
    
    for (const domain of Object.values(this.domainDatabase)) {
      scores[domain.id] = this.calculateSingleDomainScore(symptoms, patientProfile, domain);
    }
    
    return scores;
  }

  private calculateSingleDomainScore(
    symptoms: string[],
    patientProfile: PatientProfile,
    domain: SimplifiedDomain
  ): number {
    let score = 0;
    
    // Symptom matching score
    score += this.calculateSymptomScore(symptoms, domain);
    
    // Age factor score
    score += this.calculateAgeScore(patientProfile, domain);
    
    // BMI factor score
    score += this.calculateBMIScore(patientProfile, domain);
    
    return Math.min(score, 1.0);
  }

  private calculateSymptomScore(symptoms: string[], domain: SimplifiedDomain): number {
    let score = 0;
    for (const symptom of symptoms) {
      if (this.isDomainRelevant(symptom, domain)) {
        score += 0.3;
      }
    }
    return score;
  }

  private calculateAgeScore(patientProfile: PatientProfile, domain: SimplifiedDomain): number {
    if (!patientProfile.age) return 0;
    
    let score = 0;
    if (patientProfile.age >= 35 && domain.id === 'female_factor') {
      score += 0.2;
    }
    if (patientProfile.partnerAge && patientProfile.partnerAge >= 40 && domain.id === 'male_factor') {
      score += 0.15;
    }
    return score;
  }

  private calculateBMIScore(patientProfile: PatientProfile, domain: SimplifiedDomain): number {
    if (!patientProfile.bmi) return 0;
    
    if ((patientProfile.bmi < 18.5 || patientProfile.bmi > 30) && domain.id === 'female_factor') {
      return 0.1;
    }
    return 0;
  }

  private isDomainRelevant(symptom: string, domain: SimplifiedDomain): boolean {
    const symptomLower = symptom.toLowerCase();
    
    switch (domain.id) {
      case 'female_factor':
        return symptomLower.includes('ovulación') || 
               symptomLower.includes('menstrual') || 
               symptomLower.includes('hormonal') ||
               symptomLower.includes('pcos') ||
               symptomLower.includes('endometriosis');
               
      case 'male_factor':
        return symptomLower.includes('esperm') || 
               symptomLower.includes('masculino') || 
               symptomLower.includes('testicular');
               
      case 'couple_factor':
        return symptomLower.includes('inexplicada') || 
               symptomLower.includes('inmunológic') || 
               symptomLower.includes('pareja');
               
      default:
        return false;
    }
  }

  private generateBasicInsights(
    primaryDomain: SimplifiedDomain,
    symptoms: string[]
  ): NestedDomainInsight[] {
    
    const insights: NestedDomainInsight[] = [];
    
    insights.push({
      domain: primaryDomain.name,
      insight: `Análisis especializado en ${primaryDomain.specialization} basado en síntomas presentados`,
      evidenceLevel: 'B' as EvidenceLevel,
      clinicalRelevance: 0.85,
      emergentPattern: false
    });
    
    if (symptoms.length >= 3) {
      insights.push({
        domain: primaryDomain.name,
        insight: `Patrón complejo detectado con ${symptoms.length} síntomas en dominio ${primaryDomain.name}`,
        evidenceLevel: 'B' as EvidenceLevel,
        clinicalRelevance: 0.75,
        emergentPattern: true
      });
    }
    
    return insights;
  }

  private getRelevantPathologies(domain: SimplifiedDomain): unknown[] {
    return domain.pathologies.map(id => PATHOLOGIES_DATABASE[id]).filter(Boolean);
  }

  private createDomainAnalysis(
    symptoms: string[],
    patientProfile: PatientProfile,
    domainResult: DomainClassificationResult,
    relevantPathologies: unknown[]
  ): PathologyAnalysis {
    
    const primaryPathology = relevantPathologies[0] as { nameES?: string } | undefined;
    
    return {
      condition: primaryPathology?.nameES || domainResult.primaryDomain.name,
      confidence: domainResult.confidence,
      primaryDiagnosis: {
        condition: primaryPathology?.nameES || 'Evaluación en progreso',
        severity: 'mild' as const,
        confidence: domainResult.confidence
      },
      differentialDiagnoses: relevantPathologies.slice(1, 3).map(p => {
        const pathology = p as { nameES?: string } | undefined;
        return {
          condition: pathology?.nameES || 'Diagnóstico pendiente',
          severity: 'mild' as const,
          confidence: domainResult.confidence * 0.8
        };
      }),
      riskFactors: this.extractRiskFactors(symptoms, patientProfile),
      severity: 'mild' as const,
      prognosis: `Pronóstico favorable con tratamiento especializado en ${domainResult.primaryDomain.specialization}`
    };
  }

  private extractRiskFactors(symptoms: string[], patientProfile: PatientProfile): string[] {
    const riskFactors: string[] = [];
    
    if (patientProfile.age && patientProfile.age >= 35) {
      riskFactors.push('Edad materna avanzada');
    }
    
    if (patientProfile.bmi) {
      if (patientProfile.bmi >= 30) {
        riskFactors.push('Obesidad');
      } else if (patientProfile.bmi < 18.5) {
        riskFactors.push('Bajo peso');
      }
    }
    
    return riskFactors;
  }

  private createTreatmentRecommendation(
    name: string,
    description: string,
    efficacy: number
  ): TreatmentRecommendation {
    return {
      name,
      type: 'pharmacological',
      description,
      medications: [],
      duration: 'Según protocolo médico',
      efficacy,
      safety: 0.9,
      evidenceLevel: 0.8,
      cost: 'medium',
      sideEffects: [],
      contraindications: [],
      monitoring: ['Seguimiento médico regular'],
      expectedOutcome: description,
      successRate: Math.round(efficacy * 100),
      timeToEffect: '4-12 semanas',
      alternativeOptions: ['Consulta especializada']
    };
  }
}

// ====================================================================
// 🚀 EXPORT SINGLETON INSTANCE
// ====================================================================

export const simplifiedNestedDomainOrchestrator = new SimplifiedNestedDomainOrchestrator();
