export function toLocaleDate(dateString: string | undefined): string {
  if (!dateString) return 'No registrada';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(date);
}
