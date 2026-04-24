export function buildPagination(page = 1, limit = 12) {
  const normalizedPage = Math.max(Number(page) || 1, 1);
  const normalizedLimit = Math.max(Number(limit) || 12, 1);

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    skip: (normalizedPage - 1) * normalizedLimit,
  };
}

export function toMoneyBreakdown(value = 0) {
  return {
    amount: value,
    currency: "INR",
  };
}
