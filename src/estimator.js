const timeEstimator = (periodType, timeToElapse) => {
  let result;
  if (periodType === 'days') {
    const unitInDays = Math.trunc(timeToElapse / 3);
    result = 2 ** unitInDays;
  } else if (periodType === 'weeks') {
    const unitInMonths = Math.trunc((timeToElapse * 7) / 3);
    result = 2 ** unitInMonths;
  } else if (periodType === 'months') {
    const unitInWeeks = Math.trunc((timeToElapse * 30) / 3);
    result = 2 ** unitInWeeks;
  }
  return result;
};

const flightInUSD = (periodType, timeToElapse, avgDailyIncome, avgDPI) => {
  let Indays;
  if (periodType === 'days') {
    Indays = (avgDailyIncome * avgDPI) / timeToElapse;
  } else if (periodType === 'weeks') {
    Indays = (avgDailyIncome * avgDPI) / (timeToElapse * 7);
  } else if (periodType === 'months') {
    Indays = (avgDailyIncome * avgDPI) / (timeToElapse * 30);
  }
  return Indays;
};

const covid19ImpactEstimator = (data) => {
  const {
    reportedCases,
    periodType,
    timeToElapse,
    totalHospitalBeds,
    region: { avgDailyIncomeInUSD, avgDailyIncomePopulation }
  } = data;
  const impact = {};
  const severeImpact = {};
  /**
   * challenge one
   */
  impact.currentlyInfected = reportedCases * 10;
  const timEstimate = timeEstimator(periodType, timeToElapse);
  impact.infectionsByRequestedTime = (impact.currentlyInfected * timEstimate);
  severeImpact.currentlyInfected = reportedCases * 50;
  severeImpact.infectionsByRequestedTime = (severeImpact.currentlyInfected * timEstimate);
  /**
   * challenge two
   */
  impact.severeCasesByRequestedTime = impact.infectionsByRequestedTime * 0.15;
  const hospitalBeds = totalHospitalBeds * 0.35;
  const impactHospital = Math.trunc(hospitalBeds - impact.severeCasesByRequestedTime);
  impact.hospitalBedsByRequestedTime = impactHospital;
  severeImpact.severeCasesByRequestedTime = severeImpact.infectionsByRequestedTime * 0.15;
  const { severeCasesByRequestedTime, infectionsByRequestedTime } = severeImpact;
  const severeImpactHospital = Math.trunc(hospitalBeds - severeCasesByRequestedTime);
  severeImpact.hospitalBedsByRequestedTime = severeImpactHospital;
  /**
    * challenge three
    *
    */
  impact.casesForICUByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * 0.05);
  severeImpact.casesForICUByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.05);
  impact.casesForVentilatorsByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * 0.02);
  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.02);
  const getFlightUSD = flightInUSD(
    periodType,
    timeToElapse,
    avgDailyIncomeInUSD,
    avgDailyIncomePopulation
  );
  const convertDollarsForSevereImpact = infectionsByRequestedTime * getFlightUSD;
  const convertDollarsForImpact = impact.infectionsByRequestedTime * getFlightUSD;
  impact.dollarsInFlight = Math.trunc(convertDollarsForImpact);
  severeImpact.dollarsInFlight = Math.trunc(convertDollarsForSevereImpact);
  return {
    data,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
