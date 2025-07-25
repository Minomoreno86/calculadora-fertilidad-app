// ===================================================================
// ABORTION RISK CALCULATOR - MAIN MEDICAL ALGORITHM ENGINE
// Clinical Decision Support System for Pregnancy Loss Risk Assessment
// ===================================================================

import { 
  PatientInput, 
  RiskResult, 
  ValidationResult,
  ABORTION_RISK_CONSTANTS,
  SmokingStatus
} from '../models/AbortionRiskModels';
import { AbortionRiskNeuralEngine } from '../services/AbortionRiskNeuralEngine';
import { AbortionEvidenceDatabase } from '../data/AbortionEvidenceDatabase';

export class AbortionRiskCalculator {
  private neuralEngine: AbortionRiskNeuralEngine;
  private evidenceDB: AbortionEvidenceDatabase;
  
  constructor() {
    this.neuralEngine = new AbortionRiskNeuralEngine();
    this.evidenceDB = AbortionEvidenceDatabase.getInstance();
  }

  // ===================================================================
  // MAIN CALCULATION METHOD
  // ===================================================================
  
  public calculateAbortionRisk(patientData: PatientInput): RiskResult {
    // 1. Validate input data
    const validation = this.validatePatientData(patientData);
    if (!validation.isValid) {
      throw new Error(`Invalid patient data: ${validation.errors.join(', ')}`);
    }

    // 2. Process through neural network
    const neuralResult = this.neuralEngine.processNeuralNetwork(patientData);
    
    // 3. Calculate trimester-specific risks
    const trimesterRisks = this.neuralEngine.calculateTrimesterRisks(neuralResult.finalRisk);
    
    // 4. Determine risk category
    const category = this.categorizeRisk(neuralResult.finalRisk);
    
    // 5. Generate clinical recommendations
    const recommendations = this.generateRecommendations(neuralResult.finalRisk, patientData);
    
    // 6. Identify modifiable factors
    const modifiableFactors = this.identifyModifiableFactors(patientData);
    
    // 7. Generate urgent alerts if needed
    const urgentAlerts = this.generateUrgentAlerts(neuralResult.finalRisk, patientData);
    
    // 8. Get evidence references
    const activeFactors = this.getActiveRiskFactors(patientData);
    const evidenceReferences = this.evidenceDB.getReferencesForFactors(activeFactors)
      .map(ref => `${ref.authors}. ${ref.title}. ${ref.journal}. ${ref.year}.`);
    
    // 9. Calculate additional metrics
    const populationPercentile = this.calculatePopulationPercentile(neuralResult.finalRisk, patientData.age);
    const improvementPotential = this.calculateImprovementPotential(patientData);

    return {
      // Primary Results
      overallRisk: neuralResult.finalRisk,
      percentage: `${(neuralResult.finalRisk * 100).toFixed(1)}%`,
      category,
      confidence: neuralResult.neuralWeighting.confidenceScore,
      
      // Detailed Analysis
      trimesterRisks,
      neuralWeighting: neuralResult.neuralWeighting,
      riskFactorContributions: neuralResult.riskContributions,
      
      // Clinical Guidance
      modifiableFactors,
      recommendations,
      urgentAlerts,
      
      // Evidence Base
      evidenceReferences,
      calculationDate: new Date(),
      
      // Additional Metrics
      populationPercentile,
      improvementPotential
    };
  }

  // ===================================================================
  // DATA VALIDATION
  // ===================================================================
  
  private validatePatientData(patientData: PatientInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingOptimalData: string[] = [];

    // Required fields validation
    if (!patientData.age || patientData.age < 18 || patientData.age > 50) {
      errors.push('Age must be between 18 and 50 years');
    }
    
    if (patientData.obstetricHistory.totalPregnancies < 0) {
      errors.push('Total pregnancies cannot be negative');
    }
    
    if (patientData.obstetricHistory.previousAbortions < 0) {
      errors.push('Previous abortions cannot be negative');
    }
    
    if (patientData.obstetricHistory.previousLivebirths < 0) {
      errors.push('Previous live births cannot be negative');
    }

    // Logic validation
    const totalOutcomes = patientData.obstetricHistory.previousAbortions + 
                         patientData.obstetricHistory.previousLivebirths;
    
    if (totalOutcomes > patientData.obstetricHistory.totalPregnancies) {
      errors.push('Sum of abortions and live births cannot exceed total pregnancies');
    }

    // Warnings for suboptimal data
    if (patientData.age >= 35 && patientData.obstetricHistory.previousAbortions === 0) {
      warnings.push('Advanced maternal age detected - consider enhanced monitoring');
    }
    
    if (patientData.obstetricHistory.previousAbortions >= 2) {
      warnings.push('Recurrent pregnancy loss history - specialist consultation recommended');
    }

    // Missing optimal data
    if (!patientData.weight || !patientData.height) {
      missingOptimalData.push('Weight and height for BMI calculation');
    }
    
    if (!patientData.lifestyle.BMI && (!patientData.weight || !patientData.height)) {
      missingOptimalData.push('BMI or weight/height measurements');
    }

    return {
      isValid: errors.length === 0,
      warnings,
      errors,
      missingOptimalData
    };
  }

  // ===================================================================
  // RISK CATEGORIZATION
  // ===================================================================
  
  private categorizeRisk(riskValue: number): 'Low' | 'Moderate' | 'High' | 'Very High' {
    const thresholds = ABORTION_RISK_CONSTANTS.RISK_THRESHOLDS;
    
    if (riskValue < thresholds.LOW) return 'Low';
    if (riskValue < thresholds.MODERATE) return 'Moderate';
    if (riskValue < thresholds.HIGH) return 'High';
    return 'Very High';
  }

  // ===================================================================
  // CLINICAL RECOMMENDATIONS
  // ===================================================================
  
  private generateRecommendations(riskValue: number, patientData: PatientInput): string[] {
    const category = this.categorizeRisk(riskValue);
    const baseRecommendations = this.evidenceDB.getRecommendationsByRisk()[category.toLowerCase().replace(' ', '_') + '_risk'];
    
    const personalizedRecommendations = [...baseRecommendations.generalRecommendations];
    
    // Add personalized recommendations based on patient factors
    if (patientData.age >= 35) {
      personalizedRecommendations.push('Consider genetic counseling due to advanced maternal age');
      personalizedRecommendations.push('Enhanced fetal monitoring may be beneficial');
    }
    
    if (patientData.obstetricHistory.previousAbortions >= 2) {
      personalizedRecommendations.push('Complete recurrent pregnancy loss workup recommended');
      personalizedRecommendations.push('Consider aspirin therapy if no contraindications');
    }
    
    if (patientData.medicalConditions.diabetes) {
      personalizedRecommendations.push('Optimize glycemic control before conception');
      personalizedRecommendations.push('Endocrinology consultation for diabetes management');
    }
    
    if (patientData.medicalConditions.thyroidDisorder) {
      personalizedRecommendations.push('Optimize thyroid function with TSH < 2.5 mIU/L');
      personalizedRecommendations.push('Monitor thyroid function throughout pregnancy');
    }
    
    if (patientData.lifestyle.smoking !== SmokingStatus.NEVER && 
        patientData.lifestyle.smoking !== SmokingStatus.FORMER) {
      personalizedRecommendations.push('Smoking cessation counseling and support programs');
      personalizedRecommendations.push('Consider nicotine replacement therapy if appropriate');
    }
    
    if (patientData.lifestyle.BMI && patientData.lifestyle.BMI >= 30) {
      personalizedRecommendations.push('Weight reduction counseling and nutritionist referral');
      personalizedRecommendations.push('Consider bariatric surgery consultation if BMI ≥ 40');
    }

    return personalizedRecommendations;
  }

  // ===================================================================
  // MODIFIABLE FACTORS IDENTIFICATION
  // ===================================================================
  
  private identifyModifiableFactors(patientData: PatientInput): string[] {
    const modifiableFactors: string[] = [];
    
    // Lifestyle factors (highly modifiable)
    if (patientData.lifestyle.smoking !== SmokingStatus.NEVER && 
        patientData.lifestyle.smoking !== SmokingStatus.FORMER) {
      modifiableFactors.push('Smoking cessation (High impact: 45% risk reduction)');
    }
    
    if (patientData.lifestyle.BMI && patientData.lifestyle.BMI >= 30) {
      modifiableFactors.push('Weight optimization (Moderate impact: 20-30% risk reduction)');
    }
    
    if (patientData.lifestyle.alcohol && patientData.lifestyle.alcohol !== 'none') {
      modifiableFactors.push('Alcohol cessation (Moderate impact: 15% risk reduction)');
    }
    
    // Medical conditions (partially modifiable)
    if (patientData.medicalConditions.diabetes) {
      modifiableFactors.push('Glycemic control optimization (High impact: 35% risk reduction)');
    }
    
    if (patientData.medicalConditions.thyroidDisorder) {
      modifiableFactors.push('Thyroid function optimization (Moderate impact: 25% risk reduction)');
    }
    
    // Nutritional factors
    modifiableFactors.push('Folic acid supplementation (Low-Moderate impact: 10-15% risk reduction)');
    modifiableFactors.push('Stress management and psychological support (Low impact: 5-10% risk reduction)');
    
    return modifiableFactors;
  }

  // ===================================================================
  // URGENT ALERTS SYSTEM
  // ===================================================================
  
  private generateUrgentAlerts(riskValue: number, patientData: PatientInput): string[] {
    const alerts: string[] = [];
    
    // Very high risk alert
    if (riskValue > 0.5) {
      alerts.push('🚨 URGENT: Very high abortion risk detected - immediate specialist consultation required');
    }
    
    // Multiple previous losses with high risk factors
    if (patientData.obstetricHistory.previousAbortions >= 3 && riskValue > 0.3) {
      alerts.push('⚠️ CRITICAL: Multiple pregnancy losses with ongoing risk factors - comprehensive evaluation needed');
    }
    
    // Antiphospholipid syndrome
    if (patientData.medicalConditions.antiphospholipid) {
      alerts.push('🔴 HIGH PRIORITY: Antiphospholipid syndrome - anticoagulation therapy may be indicated');
    }
    
    // Advanced age with other risk factors
    if (patientData.age >= 40 && (
      patientData.obstetricHistory.previousAbortions > 0 || 
      Object.keys(patientData.medicalConditions).length > 0
    )) {
      alerts.push('⚠️ ATTENTION: Advanced maternal age with additional risk factors - enhanced monitoring essential');
    }
    
    return alerts;
  }

  // ===================================================================
  // UTILITY CALCULATIONS
  // ===================================================================
  
  private getActiveRiskFactors(patientData: PatientInput): string[] {
    const factors: string[] = [];
    
    if (patientData.age >= 35) factors.push('maternal_age_study2024');
    if (patientData.obstetricHistory.previousAbortions > 0) factors.push('acog2024_rpl');
    if (patientData.medicalConditions.thrombophilias?.length) factors.push('thrombophilia_meta2023');
    if (patientData.medicalConditions.uterineAnomalies?.length) factors.push('uterine_anomalies2024');
    if (patientData.medicalConditions.antiphospholipid) factors.push('antiphospholipid_syndrome');
    if (patientData.medicalConditions.diabetes) factors.push('diabetes_mellitus');
    if (patientData.medicalConditions.thyroidDisorder) factors.push('thyroid_disorder');
    if (patientData.lifestyle.smoking !== SmokingStatus.NEVER && 
        patientData.lifestyle.smoking !== SmokingStatus.FORMER) {
      factors.push('smoking_current');
    }
    if (patientData.lifestyle.BMI && patientData.lifestyle.BMI >= 35) {
      factors.push('obesity_bmi35');
    }
    
    return factors;
  }
  
  private calculatePopulationPercentile(riskValue: number, age: number): number {
    // Simplified population percentile calculation
    // In a real implementation, this would use population databases
    const basePopulationRisk = this.neuralEngine.calculateAgeRisk(age);
    const relativeRisk = riskValue / basePopulationRisk;
    
    // Convert to percentile (0-100)
    if (relativeRisk <= 1.0) return 50; // Average risk
    if (relativeRisk <= 1.5) return 75; // 75th percentile
    if (relativeRisk <= 2.0) return 90; // 90th percentile
    if (relativeRisk <= 3.0) return 95; // 95th percentile
    return 99; // 99th percentile
  }
  
  private calculateImprovementPotential(patientData: PatientInput): number {
    let improvementPotential = 0;
    
    // Calculate potential improvement from modifying risk factors
    if (patientData.lifestyle.smoking !== SmokingStatus.NEVER && 
        patientData.lifestyle.smoking !== SmokingStatus.FORMER) {
      improvementPotential += 0.45; // 45% improvement potential
    }
    
    if (patientData.lifestyle.BMI && patientData.lifestyle.BMI >= 30) {
      improvementPotential += 0.25; // 25% improvement potential
    }
    
    if (patientData.medicalConditions.diabetes) {
      improvementPotential += 0.35; // 35% improvement potential
    }
    
    if (patientData.medicalConditions.thyroidDisorder) {
      improvementPotential += 0.25; // 25% improvement potential
    }
    
    return Math.min(0.70, improvementPotential); // Cap at 70% improvement
  }

  // ===================================================================
  // BATCH PROCESSING (for multiple patients)
  // ===================================================================
  
  public calculateBatchRisks(patients: PatientInput[]): RiskResult[] {
    return patients.map(patient => this.calculateAbortionRisk(patient));
  }
  
  // ===================================================================
  // SYSTEM UTILITIES
  // ===================================================================
  
  public getCalculatorVersion(): string {
    return '1.0.0-neural';
  }
  
  public getLastUpdated(): Date {
    return new Date('2024-01-15'); // Based on latest medical evidence
  }
  
  public validateCalculatorHealth(): boolean {
    try {
      // Test with sample patient data
      const testPatient: PatientInput = {
        age: 30,
        obstetricHistory: {
          totalPregnancies: 2,
          previousAbortions: 1,
          previousLivebirths: 1
        },
        medicalConditions: {},
        lifestyle: {
          smoking: SmokingStatus.NEVER
        }
      };
      
      const result = this.calculateAbortionRisk(testPatient);
      return result.overallRisk > 0 && result.overallRisk < 1;
    } catch {
      return false;
    }
  }
}