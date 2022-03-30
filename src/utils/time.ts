export const padTo2Digits = (num: number) => {
  return String(num).padStart(2, "0");
};

export const getHourMinute = (date: Date) => {
  return `${padTo2Digits(date.getHours())}:${padTo2Digits(date.getMinutes())}`;
};
