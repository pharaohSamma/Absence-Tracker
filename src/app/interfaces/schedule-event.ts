export interface ScheduleEvent {
  day: string;
  startTime: string;
  endTime: string;
  title: string;
  location: string;
  teacher?: string;
  type: string;
}
