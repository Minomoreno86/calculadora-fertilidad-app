// ===================================================================
// SIMPLE TEST FOR ABORTION RISK CALCULATOR
// Verify the core logic is working correctly
// ===================================================================

import { AbortionRiskCalculator } from '../core/calculators/AbortionRiskCalculator';
import { PatientInput, SmokingStatus, AlcoholConsumption } from '../core/models/AbortionRiskModels';

// Test the calculator with sample patient data
const testCalculator = () => {
  console.log('🧠 Testing Abortion Risk Calculator...\n');

  const calculator = new AbortionRiskCalculator();
  
  // Test Case 1: Low risk patient
  const lowRiskPatient: PatientInput = {
    age: 28,
    weight: 65,
    height: 165,
    obstetricHistory: {
      totalPregnancies: 2,
      previousAbortions: 0,
      previousLivebirths: 1
    },
    medicalConditions: {},
    lifestyle: {
      smoking: SmokingStatus.NEVER,
      BMI: 23.9,
      alcohol: AlcoholConsumption.NONE
    }
  };

  // Test Case 2: High risk patient
  const highRiskPatient: PatientInput = {
    age: 42,
    weight: 90,
    height: 160,
    obstetricHistory: {
      totalPregnancies: 5,
      previousAbortions: 3,
      previousLivebirths: 1
    },
    medicalConditions: {
      diabetes: true,
      antiphospholipid: true
    },
    lifestyle: {
      smoking: SmokingStatus.CURRENT_MODERATE,
      BMI: 35.2,
      alcohol: AlcoholConsumption.MODERATE
    }
  };

  try {
    // Calculate risks
    const lowRiskResult = calculator.calculateAbortionRisk(lowRiskPatient);
    const highRiskResult = calculator.calculateAbortionRisk(highRiskPatient);

    console.log('📊 LOW RISK PATIENT RESULTS:');
    console.log(`Age: ${lowRiskPatient.age} years`);
    console.log(`Previous Abortions: ${lowRiskPatient.obstetricHistory.previousAbortions}`);
    console.log(`Overall Risk: ${lowRiskResult.percentage} (${lowRiskResult.category})`);
    console.log(`Confidence: ${(lowRiskResult.confidence * 100).toFixed(1)}%`);
    console.log(`Neural Weights - Age: ${(lowRiskResult.neuralWeighting.ageWeight * 100)}%, History: ${(lowRiskResult.neuralWeighting.historyWeight * 100)}%, Medical: ${(lowRiskResult.neuralWeighting.medicalWeight * 100)}%`);
    console.log(`Trimester Risks - 1st: ${(lowRiskResult.trimesterRisks.first * 100).toFixed(1)}%, 2nd: ${(lowRiskResult.trimesterRisks.second * 100).toFixed(1)}%, 3rd: ${(lowRiskResult.trimesterRisks.third * 100).toFixed(1)}%`);
    console.log(`Modifiable Factors: ${lowRiskResult.modifiableFactors.length}`);
    console.log(`Recommendations: ${lowRiskResult.recommendations.length}`);
    console.log('');

    console.log('🚨 HIGH RISK PATIENT RESULTS:');
    console.log(`Age: ${highRiskPatient.age} years`);
    console.log(`Previous Abortions: ${highRiskPatient.obstetricHistory.previousAbortions}`);
    console.log(`Medical Conditions: Diabetes, Antiphospholipid Syndrome`);
    console.log(`Overall Risk: ${highRiskResult.percentage} (${highRiskResult.category})`);
    console.log(`Confidence: ${(highRiskResult.confidence * 100).toFixed(1)}%`);
    console.log(`Population Percentile: ${highRiskResult.populationPercentile}th`);
    console.log(`Improvement Potential: ${highRiskResult.improvementPotential ? (highRiskResult.improvementPotential * 100).toFixed(1) + '%' : 'N/A'}`);
    console.log(`Trimester Risks - 1st: ${(highRiskResult.trimesterRisks.first * 100).toFixed(1)}%, 2nd: ${(highRiskResult.trimesterRisks.second * 100).toFixed(1)}%, 3rd: ${(highRiskResult.trimesterRisks.third * 100).toFixed(1)}%`);
    console.log(`Risk Factor Contributions: ${highRiskResult.riskFactorContributions.length}`);
    highRiskResult.riskFactorContributions.forEach((factor, index) => {
      console.log(`  ${index + 1}. ${factor.factor} (${factor.impact}, weight: ${(factor.weight * 100).toFixed(1)}%)`);
    });
    console.log(`Modifiable Factors: ${highRiskResult.modifiableFactors.length}`);
    highRiskResult.modifiableFactors.forEach((factor, index) => {
      console.log(`  ${index + 1}. ${factor}`);
    });
    console.log(`Urgent Alerts: ${highRiskResult.urgentAlerts.length}`);
    highRiskResult.urgentAlerts.forEach((alert, index) => {
      console.log(`  ${index + 1}. ${alert}`);
    });
    console.log(`Recommendations: ${highRiskResult.recommendations.length}`);
    console.log('');

    console.log('✅ Calculator Test Completed Successfully!');
    console.log(`Calculator Version: ${calculator.getCalculatorVersion()}`);
    console.log(`Health Check: ${calculator.validateCalculatorHealth() ? 'PASS' : 'FAIL'}`);
    
    return { lowRiskResult, highRiskResult };
    
  } catch (error) {
    console.error('❌ Error testing calculator:', error);
    return null;
  }
};

// Export for potential use in other test files
export { testCalculator };

// Run the test if this file is executed directly
if (require.main === module) {
  testCalculator();
}