export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatTime = (time: string): string => {
  return time;
};

export const isDateClosed = (date: Date, closedDays: string[]): boolean => {
  const dateString = date.toISOString().split("T")[0];
  return closedDays.includes(dateString);
};

export const isPastDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export const generateTimeSlots = (
  start: string,
  end: string,
  interval: number
): string[] => {
  const slots: string[] = [];
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  let currentHour = startHour;
  let currentMinute = startMinute;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMinute < endMinute)
  ) {
    slots.push(
      `${currentHour.toString().padStart(2, "0")}:${currentMinute
        .toString()
        .padStart(2, "0")}`
    );

    currentMinute += interval;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
    }
  }

  return slots;
};
