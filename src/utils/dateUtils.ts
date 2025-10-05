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

export function getCurrentWeek(date?: Date): string {
  const d = date ?? new Date();
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay()); // Sunday
  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Saturday
  return `${start.toISOString().slice(0, 10)}_${end.toISOString().slice(0, 10)}`;
};

export const getCurrentMonth = (): string => {
  return getMonthOf(new Date());
};