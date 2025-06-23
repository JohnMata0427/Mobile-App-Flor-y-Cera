export const getDominantColor = async (imageUrl: string) => {
  const response = await fetch('https://color-extractor-2bb7.onrender.com/color-dominante', {
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
