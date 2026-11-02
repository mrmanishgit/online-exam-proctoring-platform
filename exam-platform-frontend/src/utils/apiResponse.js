export function unwrapData(response) {
  const value = response?.data ?? response;
  return value?.data ?? value;
}

export function unwrapList(response) {
  const value = unwrapData(response);
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.content)) return value.content;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.results)) return value.results;
  return [];
}
