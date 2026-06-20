const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function formatCapacity(capacity: number): string {
  return `${capacity} ${capacity === 1 ? 'pessoa' : 'pessoas'}`;
}

export function formatDateTime(value: string): string {
  return dateTimeFormatter.format(new Date(value));
}

