export const toFormData = (data: any, selectedImage?: string | null) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(item => formData.append(key + '[]', item));
    } else if (key === 'imagen' && selectedImage) {
      const fileType = selectedImage.split('.').pop();
      formData.append('imagen', {
        uri: selectedImage,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    } else {
      formData.append(key, value as any);
    }
  });

  return formData;
};
