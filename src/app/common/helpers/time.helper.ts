import { timeUnitMilliseconds } from '../constants';

export const convertToMilliseconds = (timeString: string) => {
  const matches = timeString.match(/^(\d+)\s?([smhdw])$/);

  if (matches) {
    const number = parseInt(matches[1]);
    const unit = matches[2];
    if (timeUnitMilliseconds[unit]) {
      return number * timeUnitMilliseconds[unit];
    }
  }

  throw new Error(`Time ${timeString} cannot be decoded`);
};
