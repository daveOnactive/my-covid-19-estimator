const factor = (periodType) => {
  switch(periodType) {
    case 'days':
      return 1 ;
    case 'weeks':
      return 7 / 3;
    case 'months':
      return 30 / 3;
    default:
      return;
  }
};

export default factor;