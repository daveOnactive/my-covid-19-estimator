const roundNum = (num) => Math.trunc(num);

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
  return roundNum(data / 3);
};

const percentage = (num, percent) => roundNum((num * percent) / 100);

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
  // impact.casesForICUByRequestedTime = percentage(impactInfectionsByRequestedTime, 5);
  // severeImpact.casesForICUByRequestedTime = percentage(sImpactInfectionsByRequestedTime, 5);

  // casesForVentilatorsByRequestedTime
  impact.casesForVentilatorsByRequestedTime = percentage(impactInfectionsByRequestedTime, 2);
  const z = percentage(sImpactInfectionsByRequestedTime, 2);
  severeImpact.sImpactCaseForVentilatorsByRequestedTime = z;
  impact.casesForICUByRequestedTime = percentage(impactInfectionsByRequestedTime, 5);
  const x = percentage(sImpactInfectionsByRequestedTime, 5);
  severeImpact.casesForICUByRequestedTime = x;

  // const y = Math.trunc(percentage(impactInfectionsByRequestedTime, 2));
  // impact.casesForVentilatorsByRequestedTime = y;
  // const sImpactCaseForVentilators = Math.trunc(percentage(sImpactInfectionsByRequestedTime, 2));
  // severeImpact.casesForVentilatorsByRequestedTime = sImpactCaseForVentilators;

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
