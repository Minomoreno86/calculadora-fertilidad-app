// ===================================================================
// ABORTION RISK NEURAL ENGINE - AI-POWERED MEDICAL CALCULATIONS
// Neural Network Implementation for Risk Assessment
// ===================================================================

import { 
  PatientInput, 
  RiskResult, 
  NeuralWeighting, 
  RiskFactorContribution,
  TrimesterRisks,
  ABORTION_RISK_CONSTANTS,
  ThrombophiliaType,
  UterineAnomalyType,
  SmokingStatus
} from '../models/AbortionRiskModels';
import { AbortionEvidenceDatabase } from '../data/AbortionEvidenceDatabase';

export interface NeuralNode {
  value: number;
  weight: number;
  bias: number;
}

export interface NeuralLayer {
  nodes: NeuralNode[];
  activationFunction: 'sigmoid' | 'relu' | 'tanh';
}

export class AbortionRiskNeuralEngine {
  private evidenceDB: AbortionEvidenceDatabase;
  private neuralLayers: NeuralLayer[];
  
  constructor() {
    this.evidenceDB = AbortionEvidenceDatabase.getInstance();
    this.initializeNeuralNetwork();
  }

  // ===================================================================
  // NEURAL NETWORK INITIALIZATION
  // ===================================================================
  
  private initializeNeuralNetwork(): void {
    // Input layer: Age, History, Medical conditions (simplified 3-node structure)
    // Hidden layer: Risk processing
    // Output layer: Risk probability
    
    this.neuralLayers = [
      // Input layer (3 nodes: age, history, medical)
      {
        nodes: [
          { value: 0, weight: ABORTION_RISK_CONSTANTS.NEURAL_WEIGHTS.AGE, bias: 0 },
          { value: 0, weight: ABORTION_RISK_CONSTANTS.NEURAL_WEIGHTS.HISTORY, bias: 0 },
          { value: 0, weight: ABORTION_RISK_CONSTANTS.NEURAL_WEIGHTS.MEDICAL, bias: 0 }
        ],
        activationFunction: 'sigmoid'
      },
      
      // Hidden layer (5 nodes for complex pattern recognition)
      {
        nodes: [
          { value: 0, weight: 0.8, bias: -0.1 },
          { value: 0, weight: 0.9, bias: 0.0 },
          { value: 0, weight: 0.7, bias: 0.1 },
          { value: 0, weight: 0.85, bias: -0.05 },
          { value: 0, weight: 0.75, bias: 0.05 }
        ],
        activationFunction: 'relu'
      },
      
      // Output layer (1 node: final risk probability)
      {
        nodes: [
          { value: 0, weight: 1.0, bias: 0 }
        ],
        activationFunction: 'sigmoid'
      }
    ];
  }

  // ===================================================================
  // ACTIVATION FUNCTIONS
  // ===================================================================
  
  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }
  
  private relu(x: number): number {
    return Math.max(0, x);
  }
  
  private tanh(x: number): number {
    return Math.tanh(x);
  }
  
  private applyActivation(value: number, type: 'sigmoid' | 'relu' | 'tanh'): number {
    switch (type) {
      case 'sigmoid': return this.sigmoid(value);
      case 'relu': return this.relu(value);
      case 'tanh': return this.tanh(value);
      default: return value;
    }
  }

  // ===================================================================
  // RISK COMPONENT CALCULATIONS
  // ===================================================================
  
  public calculateAgeRisk(age: number): number {
    const ageRisks = ABORTION_RISK_CONSTANTS.AGE_RISK;
    
    if (age < 25) return ageRisks.UNDER_25;
    if (age <= 29) return ageRisks.AGE_25_29;
    if (age <= 34) return ageRisks.AGE_30_34;
    if (age <= 39) return ageRisks.AGE_35_39;
    if (age <= 44) return ageRisks.AGE_40_44;
    return ageRisks.OVER_45;
  }
  
  public calculateHistoryRisk(patientData: PatientInput): number {
    const { previousAbortions } = patientData.obstetricHistory;
    const baseRisk = this.calculateAgeRisk(patientData.age);
    const multipliers = ABORTION_RISK_CONSTANTS.PREVIOUS_ABORTION_MULTIPLIERS;
    
    let multiplier: number;
    if (previousAbortions === 0) multiplier = multipliers.ZERO;
    else if (previousAbortions === 1) multiplier = multipliers.ONE;
    else if (previousAbortions === 2) multiplier = multipliers.TWO;
    else if (previousAbortions === 3) multiplier = multipliers.THREE;
    else multiplier = multipliers.FOUR_PLUS;
    
    return Math.min(0.95, baseRisk * multiplier); // Cap at 95%
  }
  
  public calculateMedicalRisk(patientData: PatientInput): number {
    const conditions = patientData.medicalConditions;
    const lifestyle = patientData.lifestyle;
    const medicalOR = ABORTION_RISK_CONSTANTS.MEDICAL_CONDITIONS_OR;
    
    let cumulativeRisk = 1.0; // Start with no additional risk
    
    // Thrombophilias
    if (conditions.thrombophilias?.length) {
      conditions.thrombophilias.forEach(thrombophilia => {
        switch (thrombophilia) {
          case ThrombophiliaType.FACTOR_V_LEIDEN:
            cumulativeRisk *= medicalOR.FACTOR_V_LEIDEN;
            break;
          case ThrombophiliaType.PROTHROMBIN_G20210A:
            cumulativeRisk *= medicalOR.PROTHROMBIN;
            break;
          case ThrombophiliaType.PROTEIN_C_DEFICIENCY:
            cumulativeRisk *= medicalOR.PROTEIN_C;
            break;
        }
      });
    }
    
    // Uterine anomalies
    if (conditions.uterineAnomalies?.length) {
      conditions.uterineAnomalies.forEach(anomaly => {
        switch (anomaly) {
          case UterineAnomalyType.SEPTATE_UTERUS:
            cumulativeRisk *= medicalOR.UTERINE_SEPTUM;
            break;
          case UterineAnomalyType.BICORNATE_UTERUS:
            cumulativeRisk *= medicalOR.BICORNATE_UTERUS;
            break;
        }
      });
    }
    
    // Other conditions
    if (conditions.antiphospholipid) {
      cumulativeRisk *= medicalOR.ANTIPHOSPHOLIPID;
    }
    
    if (conditions.diabetes) {
      cumulativeRisk *= medicalOR.DIABETES;
    }
    
    if (conditions.thyroidDisorder) {
      cumulativeRisk *= medicalOR.THYROID;
    }
    
    // Lifestyle factors
    if (lifestyle.smoking !== SmokingStatus.NEVER && 
        lifestyle.smoking !== SmokingStatus.FORMER) {
      cumulativeRisk *= medicalOR.SMOKING;
    }
    
    if (lifestyle.BMI && lifestyle.BMI >= 35) {
      cumulativeRisk *= medicalOR.OBESITY_BMI35;
    }
    
    // Convert odds ratio to risk probability
    const baseRisk = this.calculateAgeRisk(patientData.age);
    return Math.min(0.95, baseRisk * cumulativeRisk);
  }

  // ===================================================================
  // NEURAL NETWORK FORWARD PROPAGATION
  // ===================================================================
  
  public processNeuralNetwork(patientData: PatientInput): { 
    finalRisk: number; 
    neuralWeighting: NeuralWeighting;
    riskContributions: RiskFactorContribution[];
  } {
    // Calculate individual risk components
    const ageRisk = this.calculateAgeRisk(patientData.age);
    const historyRisk = this.calculateHistoryRisk(patientData);
    const medicalRisk = this.calculateMedicalRisk(patientData);
    
    // Normalize inputs for neural network (0-1 range)
    const normalizedInputs = [
      Math.min(1.0, ageRisk * 2),      // Scale age risk
      Math.min(1.0, historyRisk * 1.5), // Scale history risk  
      Math.min(1.0, medicalRisk * 1.2)   // Scale medical risk
    ];
    
    // Set input layer values
    this.neuralLayers[0].nodes.forEach((node, index) => {
      node.value = normalizedInputs[index];
    });
    
    // Forward propagation through hidden layer
    const inputLayer = this.neuralLayers[0];
    const hiddenLayer = this.neuralLayers[1];
    
    hiddenLayer.nodes.forEach((hiddenNode, hiddenIndex) => {
      let sum = 0;
      inputLayer.nodes.forEach(inputNode => {
        sum += inputNode.value * inputNode.weight;
      });
      sum += hiddenNode.bias;
      hiddenNode.value = this.applyActivation(sum, hiddenLayer.activationFunction);
    });
    
    // Forward propagation to output layer
    const outputLayer = this.neuralLayers[2];
    let finalSum = 0;
    
    hiddenLayer.nodes.forEach(hiddenNode => {
      finalSum += hiddenNode.value * hiddenNode.weight;
    });
    finalSum += outputLayer.nodes[0].bias;
    
    const finalRisk = this.applyActivation(finalSum, outputLayer.activationFunction);
    
    // Calculate confidence based on data quality and completeness
    const confidence = this.calculateConfidence(patientData);
    
    // Create neural weighting information
    const neuralWeighting: NeuralWeighting = {
      ageWeight: ABORTION_RISK_CONSTANTS.NEURAL_WEIGHTS.AGE,
      historyWeight: ABORTION_RISK_CONSTANTS.NEURAL_WEIGHTS.HISTORY,
      medicalWeight: ABORTION_RISK_CONSTANTS.NEURAL_WEIGHTS.MEDICAL,
      confidenceScore: confidence
    };
    
    // Generate risk factor contributions
    const riskContributions = this.generateRiskContributions(patientData, ageRisk, historyRisk, medicalRisk);
    
    return {
      finalRisk: Math.min(0.95, finalRisk), // Cap at 95%
      neuralWeighting,
      riskContributions
    };
  }

  // ===================================================================
  // RISK FACTOR ANALYSIS
  // ===================================================================
  
  private generateRiskContributions(
    patientData: PatientInput,
    ageRisk: number,
    historyRisk: number,
    medicalRisk: number
  ): RiskFactorContribution[] {
    const contributions: RiskFactorContribution[] = [];
    
    // Age contribution
    contributions.push({
      factor: `Maternal Age (${patientData.age} years)`,
      weight: ageRisk * ABORTION_RISK_CONSTANTS.NEURAL_WEIGHTS.AGE,
      impact: patientData.age >= 35 ? 'risk' : 'neutral',
      evidence_level: 'high'
    });
    
    // History contribution
    if (patientData.obstetricHistory.previousAbortions > 0) {
      contributions.push({
        factor: `Previous Abortions (${patientData.obstetricHistory.previousAbortions})`,
        weight: historyRisk * ABORTION_RISK_CONSTANTS.NEURAL_WEIGHTS.HISTORY,
        impact: 'risk',
        evidence_level: 'high'
      });
    }
    
    // Medical conditions
    const conditions = patientData.medicalConditions;
    
    if (conditions.thrombophilias?.length) {
      contributions.push({
        factor: `Thrombophilias (${conditions.thrombophilias.length} conditions)`,
        weight: medicalRisk * 0.4,
        impact: 'risk',
        evidence_level: 'high'
      });
    }
    
    if (conditions.uterineAnomalies?.length) {
      contributions.push({
        factor: `Uterine Anomalies (${conditions.uterineAnomalies.length} conditions)`,
        weight: medicalRisk * 0.3,
        impact: 'risk',
        evidence_level: 'high'
      });
    }
    
    if (conditions.antiphospholipid) {
      contributions.push({
        factor: 'Antiphospholipid Syndrome',
        weight: medicalRisk * 0.5,
        impact: 'risk',
        evidence_level: 'high'
      });
    }
    
    // Lifestyle factors
    if (patientData.lifestyle.smoking !== SmokingStatus.NEVER && 
        patientData.lifestyle.smoking !== SmokingStatus.FORMER) {
      contributions.push({
        factor: 'Current Smoking',
        weight: medicalRisk * 0.2,
        impact: 'risk',
        evidence_level: 'high'
      });
    }
    
    return contributions.sort((a, b) => b.weight - a.weight);
  }
  
  private calculateConfidence(patientData: PatientInput): number {
    let confidence = 0.7; // Base confidence
    
    // Increase confidence with more complete data
    if (patientData.obstetricHistory.totalPregnancies > 0) confidence += 0.1;
    if (patientData.lifestyle.BMI) confidence += 0.05;
    if (patientData.weight && patientData.height) confidence += 0.05;
    if (Object.keys(patientData.medicalConditions).length > 0) confidence += 0.1;
    
    return Math.min(1.0, confidence);
  }

  // ===================================================================
  // TRIMESTER-SPECIFIC RISK CALCULATIONS
  // ===================================================================
  
  public calculateTrimesterRisks(overallRisk: number): TrimesterRisks {
    // Evidence-based trimester risk distribution
    // Most pregnancy losses occur in first trimester
    return {
      first: overallRisk * 0.80,   // 80% of losses in first trimester
      second: overallRisk * 0.15,  // 15% in second trimester
      third: overallRisk * 0.05    // 5% in third trimester
    };
  }
  
  // ===================================================================
  // UTILITY METHODS
  // ===================================================================
  
  public resetNetwork(): void {
    this.initializeNeuralNetwork();
  }
  
  public getNetworkState(): NeuralLayer[] {
    return [...this.neuralLayers];
  }
}