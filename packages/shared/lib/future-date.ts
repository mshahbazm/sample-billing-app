export default function FutureDate(days: number) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  const unixTimestamp = Math.floor(futureDate.getTime() / 1000);
  return {
    date: futureDate,
    unixDate: unixTimestamp
  };
}