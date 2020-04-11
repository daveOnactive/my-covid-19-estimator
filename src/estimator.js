
const roundNum = num => Math.floor(num);

const power = (num, pow) => Math.pow(num, pow);

const dateType = (type, days) => {
  switch(type) {
    case 'days':
      return days;
    case 'weeks':
      return 7 * days;
    case 'months':
      return 30 * days
    default:
      return days;
  }
}

const factor = (periodType, days) => {
  const data = dateType(periodType, days);
  return data / 3;
};

const dollarsInFlight = (data, days, periodType) => (data * 0.65 * 4) / dateType(periodType, days);

const percentageMethod = (num, percentage) => num * percentage / 100;

const covid19ImpactEstimator = (data) => {

  // currentlyInfected
  const impactCurrentlyInfected = data.data.reportedCases * 10;
  const sImpactCurrentlyInfected = data.data.reportedCases * 50;

  data.impact.currentlyInfected = impactCurrentlyInfected;
  data.severeImpact.currentlyInfected = sImpactCurrentlyInfected;

  //infectionsByRequestedTime
  const factorNum = factor(data.data.periodType, data.data.timeToElapse);
  const rFactorNum = roundNum(factorNum);
  const impactInfectionsByRequestedTime = impactCurrentlyInfected * power(2, rFactorNum);
  const sImpactInfectionsByRequestedTime = sImpactCurrentlyInfected * power(2, rFactorNum);

  data.impact.infectionsByRequestedTime = impactInfectionsByRequestedTime;
  data.severeImpact.infectionsByRequestedTime = sImpactInfectionsByRequestedTime;

  //severeCasesByRequestedTime
  const impactSevereCasesByRequestedTime = percentageMethod(impactInfectionsByRequestedTime, 15);
  const sImpactSevereCasesByRequestedTime = percentageMethod(sImpactInfectionsByRequestedTime, 15);

  data.impact.severeCasesByRequestedTime = roundNum(impactSevereCasesByRequestedTime);
  data.severeImpact.severeCasesByRequestedTime = roundNum(sImpactSevereCasesByRequestedTime);

  //hospitalBedsByRequestedTime
  const impactHospitalBedsByRequestedTime = percentageMethod(data.data.totalHospitalBeds, 35) - roundNum(impactSevereCasesByRequestedTime);
  const sImpactHospitalBedsByRequestedTime = percentageMethod(data.data.totalHospitalBeds, 35) - roundNum(sImpactSevereCasesByRequestedTime);

  data.impact.hospitalBedsByRequestedTime = roundNum(impactHospitalBedsByRequestedTime);
  data.severeImpact.hospitalBedsByRequestedTime = roundNum(sImpactHospitalBedsByRequestedTime);

  //casesForICUByRequestedTime
  const impactCasesForICUByRequestedTime = percentageMethod(impactInfectionsByRequestedTime, 5);
  const sImpactCasesForICUByRequestedTime = percentageMethod(sImpactInfectionsByRequestedTime, 5);

  data.impact.casesForICUByRequestedTime = roundNum(impactCasesForICUByRequestedTime);
  data.severeImpact.casesForICUByRequestedTime = roundNum(sImpactCasesForICUByRequestedTime);

  // casesForVentilatorsByRequestedTime
  const impactCaseForVentilatorsByRequestedTime = percentageMethod(impactInfectionsByRequestedTime, 2);
  const sImpactCaseForVentilatorsByRequestedTime = percentageMethod(sImpactInfectionsByRequestedTime, 2);

  data.impact.casesForVentilatorsByRequestedTime = roundNum(impactCaseForVentilatorsByRequestedTime);
  data.severeImpact.sImpactCaseForVentilatorsByRequestedTime = roundNum(sImpactCaseForVentilatorsByRequestedTime);

  // dollarsInFlight
  const days = dateType(data.data.periodType, data.data.timeToElapse);
  data.impact.dollarsInFlight = roundNum(impactInfectionsByRequestedTime * data.region.avgDailyIncomeInUSD * data.region.avgDailyIncomePopulation * days);
  data.severeImpact.dollarsInFlight = roundNum(sImpactInfectionsByRequestedTime * data.region.avgDailyIncomeInUSD * data.region.avgDailyIncomePopulation * days);
}

export default covid19ImpactEstimator;
