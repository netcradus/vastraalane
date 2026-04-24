export function getUserScopedKey(baseKey, user) {
  const userId = user?._id;
  return userId ? `${baseKey}:${userId}` : null;
}
