export const STATUS_LABELS = {
  confirmed: 'Təsdiqlənib',
  'checked-in': 'Giriş edilib',
  'checked-out': 'Çıxış edilib',
  cancelled: 'Ləğv edilib',
};

export const NEXT_STATUSES = {
  confirmed: ['checked-in', 'cancelled'],
  'checked-in': ['checked-out'],
  'checked-out': [],
  cancelled: [],
};
