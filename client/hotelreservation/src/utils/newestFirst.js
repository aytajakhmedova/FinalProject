// Admin lists show the most recently created record first.
// Uses createdAt when the record has one, otherwise the numeric id (ids grow with every new record).
export const newestFirst = (items) => {
  const list = Array.isArray(items) ? [...items] : [];
  return list.sort((a, b) => {
    const byDate = Date.parse(b?.createdAt || '') - Date.parse(a?.createdAt || '');
    if (!Number.isNaN(byDate) && byDate !== 0) return byDate;
    return (Number(b?.id) || 0) - (Number(a?.id) || 0);
  });
};
