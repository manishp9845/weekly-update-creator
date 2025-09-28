import { format, startOfWeek, parseISO } from 'date-fns';

export const getWeekOf = (date: Date): string => {
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  return format(monday, 'yyyy-MM-dd');
};

export const getMonthOf = (date: Date): string => {
  return format(date, 'yyyy-MM');
};

export const formatWeekRange = (weekOf: string): string => {
  const monday = parseISO(weekOf);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  return `${format(monday, 'MMM dd')} - ${format(sunday, 'MMM dd, yyyy')}`;
};

export const formatMonthRange = (monthOf: string): string => {
  const date = parseISO(`${monthOf}-01`);
  return format(date, 'MMMM yyyy');
};

export const getCurrentWeek = (): string => {
  return getWeekOf(new Date());
};

export const getCurrentMonth = (): string => {
  return getMonthOf(new Date());
};