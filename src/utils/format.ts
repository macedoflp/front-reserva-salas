const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
});

export function formatCapacity(capacity: number): string {
  return `${capacity} ${capacity === 1 ? 'pessoa' : 'pessoas'}`;
}

export function formatDateTime(value: string): string {
  return dateTimeFormatter.format(new Date(value));
}

export function formatReservationPeriod(startsAt: string, endsAt: string): string {
  return `${formatDateTime(startsAt)} - ${timeFormatter.format(new Date(endsAt))}`;
}
