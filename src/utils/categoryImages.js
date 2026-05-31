export function getPrimaryImage(item) {
  if (!item) return '';
  if (item.image) return item.image;
  if (Array.isArray(item.images) && item.images.length > 0) return item.images[0];
  return '';
}

export function normalizeCategoryImages(data) {
  const gallery = Array.isArray(data.images) ? data.images.filter(Boolean) : [];
  const image = data.image || gallery[0] || '';
  const images = image
    ? [image, ...gallery.filter((img) => img !== image)]
    : gallery;

  return { ...data, image, images };
}
