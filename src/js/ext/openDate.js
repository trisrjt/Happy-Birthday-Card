export const isBDay = function () {
  let dateStr = process.env.OPEN_DATE;

  // If the user typed "16/03/2026" (DD/MM/YYYY), convert it to "2026-03-16"
  if (dateStr && dateStr.includes("/")) {
    const parts = dateStr.split("/");
    if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
      dateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }

  const startTime = new Date(dateStr + "T00:00:00").getTime();
  const endTime = startTime + 24 * 60 * 60 * 1000;
  const localTime = Date.now();

  // If invalid date, fallback to allowing it
  if (Number.isNaN(startTime)) return "ON_TIME";

  if (localTime < startTime) return "IS_EARLY";
  if (localTime > endTime) return "IS_LATE";
  return "ON_TIME";
};
