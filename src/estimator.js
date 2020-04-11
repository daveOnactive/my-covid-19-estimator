const roundNum = (num) => Math.floor(num);

const power = (num, pow) => num ** pow;

const dateType = (type, days) => {
  switch (type) {
    case 'days':
      return days;
    case 'weeks':
      return 7 * days;
    case 'months':
      return 30 * days;
    default:
      return days;
  }
};

const factor = (periodType, days) => {
  const data = dateType(periodType, days);
  return data / 3;
};

const percentage = (num, percent) => (num * percent) / 100;

const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};

  // currentlyInfected
  const impactInfected = data.reportedCases * 10;
  const sImpactInfected = data.reportedCases * 50;

  impact.currentlyInfected = impactInfected;
  severeImpact.currentlyInfected = sImpactInfected;

  // infectionsByRequestedTime
  const factorNum = factor(data.periodType, data.timeToElapse);
  const rFactorNum = roundNum(factorNum);
  const impactInfectionsByRequestedTime = roundNum(impactInfected * power(2, rFactorNum));
  const sImpactInfectionsByRequestedTime = roundNum(sImpactInfected * power(2, rFactorNum));

  impact.infectionsByRequestedTime = impactInfectionsByRequestedTime;
  severeImpact.infectionsByRequestedTime = sImpactInfectionsByRequestedTime;

  // severeCasesByRequestedTime
  const impactSevereCases = percentage(impactInfectionsByRequestedTime, 15);
  const sImpactSevereCases = percentage(sImpactInfectionsByRequestedTime, 15);

  impact.severeCasesByRequestedTime = roundNum(impactSevereCases);
  severeImpact.severeCasesByRequestedTime = roundNum(sImpactSevereCases);

  // hospitalBedsByRequestedTime
  const roundValue = roundNum(percentage(data.totalHospitalBeds, 35));
  const impactHospital = roundValue - roundNum(impactSevereCases);
  const sImpactHospital = roundValue - roundNum(sImpactSevereCases);

  impact.hospitalBedsByRequestedTime = roundNum(impactHospital) + 1;
  severeImpact.hospitalBedsByRequestedTime = roundNum(sImpactHospital) + 1;

  // casesForICUByRequestedTime
  // const impactCasesForICUByRequestedTime = percentage(impactInfectionsByRequestedTime, 5);
  // const sImpactCasesForICUByRequestedTime = percentage(sImpactInfectionsByRequestedTime, 5);

  // impact.casesForICUByRequestedTime = roundNum(impactCasesForICUByRequestedTime);
  // severeImpact.casesForICUByRequestedTime = roundNum(sImpactCasesForICUByRequestedTime);

  // // casesForVentilatorsByRequestedTime
  // const impactCaseForVentilators = percentage(impactInfectionsByRequestedTime, 2);
  // const sImpactCaseForVentilators = percentage(sImpactInfectionsByRequestedTime, 2);

  // impact.casesForVentilatorsByRequestedTime = roundNum(impactCaseForVentilators);
  // severeImpact.sImpactCaseForVentilatorsByRequestedTime = roundNum(sImpactCaseForVentilators);
  impact.casesForICUByRequestedTime = Math.trunc(impactInfectionsByRequestedTime * 0.05);
  severeImpact.casesForICUByRequestedTime = Math.trunc(sImpactInfectionsByRequestedTime * 0.05);
  impact.casesForVentilatorsByRequestedTime = Math.trunc(impactInfectionsByRequestedTime * 0.02);
  const sImpactCaseForVentilators = Math.trunc(impactInfectionsByRequestedTime * 0.02);
  severeImpact.casesForVentilatorsByRequestedTime = sImpactCaseForVentilators;

  // dollarsInFlight
  const days = dateType(data.periodType, data.timeToElapse);
  const Daily = data.region.avgDailyIncomeInUSD;
  const income = data.region.avgDailyIncomePopulation;
  impact.dollarsInFlight = roundNum(impactInfectionsByRequestedTime * Daily * income * days);
  severeImpact.dollarsInFlight = roundNum(sImpactInfectionsByRequestedTime * Daily * income * days);

  return {
    data,
    impact,
    severeImpact
  };
};
export default covid19ImpactEstimator;
