import type { Category } from '@/interfaces/Category';

export const capitalizeWord = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getCategoryName = (category: Category | string, categories: Category[]) => {
  if (typeof category === 'string') {
    return categories.find(cat => cat._id === category)?.nombre ?? 'Sin categoría';
  }
  return category.nombre ?? 'Sin categoría';
};
