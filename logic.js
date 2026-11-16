// The "brain" of the app: pure functions with no page or browser code in them.
// Keeping logic separate from the screen is what makes it easy to TEST.

// How much cheaper is the price now than what you paid? Never negative.
// Returns 0 if we don't know the current price yet.
export function priceDrop(paid, currentPrice) {
  if (currentPrice === null || currentPrice === undefined) return 0;
  const drop = paid - currentPrice;
  if (drop <= 0) return 0;
  return Math.round(drop * 100) / 100; // avoid float noise like 0.1 + 0.2
}

// Should we tell the user to rebook? Only if it's cheaper AND free to change.
export function shouldRebook(booking) {
  return booking.refundable && priceDrop(booking.paid, booking.currentPrice) > 0;
}

export function formatMoney(n) {
  return "$" + Number(n).toFixed(2);
}
