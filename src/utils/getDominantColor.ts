const API_COLOR_EXTRACTOR = process.env.EXPO_PUBLIC_API_COLOR_EXTRACTOR ?? '';

export const getDominantColor = async (imageUrl: string) => {
  const response = await fetch(API_COLOR_EXTRACTOR, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl }),
  });

  const data = await response.json();

  if (response.ok) {
    return data.color;
  }

  return '#000000';
};

export function colorToBase64(hex: string): string {
  hex = hex.replace('#', '');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="#${hex}"/></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}