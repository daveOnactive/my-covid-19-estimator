// import { factor } from './factor';
// import { power, roundNum } from './mathMethods';
// import { percentageMethod } from './percentage';
const data = {
  reportedCases: 2747,
  periodType: 'days',
  timeToElapse: 38,
}

const roundNum = num => Math.floor(num);

const power = (num, pow) => Math.pow(num, pow);

const factor = (periodType, days) => {
  switch(periodType) {
    case 'days':
      return 1 * days / 3 ;
    case 'weeks':
      return 7 * days / 3;
    case 'months':
      return 30 * days / 3;
    default:
      return;
  }
};


const covid19ImpactEstimator = (data) => {
  const impact = {}
  const severeImpact = {}

  // currentlyInfected
  const impactCurrentlyInfected = data.reportedCases * 10;
  const sImpactCurrentlyInfected = data.reportedCases * 50;
  impact.currentlyInfected = impactCurrentlyInfected;
  severeImpact.currentlyInfected = sImpactCurrentlyInfected;

  //infectionsByRequestedTime
  const factorNum = factor(data.periodType, data.timeToElapse);
  const rFactorNum = roundNum(factorNum);
  const impactInfectionsByRequestedTime = impactCurrentlyInfected * power(2, rFactorNum);
  const sImpactInfectionsByRequestedTime = sImpactCurrentlyInfected * power(2, rFactorNum);
  impact.infectionsByRequestedTime = impactInfectionsByRequestedTime;
  severeImpact.infectionsByRequestedTime = sImpactInfectionsByRequestedTime;

  //severeCasesByRequestedTime
  const impact

  //hospitalBedsByRequestedTime

}

 const a = covid19ImpactEstimator(data);
 console.log(a);
// export default covid19ImpactEstimator;
