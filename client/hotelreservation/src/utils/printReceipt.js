const money = (value) => {
  const amount = Number(value) || 0;
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
};

export function printBookingReceipt(booking) {
  if (!booking) return;
  const code = booking.code || booking.confirmationNumber || booking.id;
  const popup = window.open('', '_blank', 'width=720,height=900');
  if (!popup) return;
  popup.document.write(`<!doctype html><html><head><title>Rezervasiya ${code}</title>
    <style>body{font-family:Arial,sans-serif;padding:32px;color:#1c1917}h1{font-size:20px}p{margin:8px 0}</style>
    </head><body>
    <h1>AE Hotel rezervasiya sənədi</h1>
    <p>Kod: <strong>${code}</strong></p>
    <p>Status: ${booking.status || ''}</p>
    <p>Otel: ${booking.hotelName || booking.itemName || ''}</p>
    <p>Otaq: ${booking.roomName || booking.roomType || booking.itemName || ''}</p>
    <p>Tarixlər: ${booking.checkIn || ''} — ${booking.checkOut || ''}</p>
    <p>Qonaq sayı: ${booking.guests || 1}</p>
    <p>Qiymət: ₼ ${money(booking.totalPrice)}</p>
    <p>Ödəniş üsulu: ${booking.paymentMethod || ''}</p>
    <p>Ödəniş statusu: ${booking.paymentStatus || ''}</p>
    ${[20, 30, 40].includes(Number(booking.depositPercent)) ? `
    <p>Kartla avans (${booking.depositPercent}%): ₼ ${money(booking.depositAmount)}</p>
    <p>Oteldə qalıq: ₼ ${money(booking.remainingAmount)}</p>` : ''}
    <p>Kart ödənişi demo rejimindədir. Real kart məlumatı saxlanılmır.</p>
    </body></html>`);
  popup.document.close();
  popup.focus();
  popup.print();
}
