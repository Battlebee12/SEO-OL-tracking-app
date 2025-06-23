// utils.js
function calculateShiftDuration(signIn, signOut) {
  if (!signIn || !signOut) return null;

  const signInTime = new Date(signIn);
  const signOutTime = new Date(signOut);

  if (isNaN(signInTime) || isNaN(signOutTime)) return null;

  const diffMs = signOutTime - signInTime;
  return Math.round(diffMs / (1000 * 60)); // in minutes
}

module.exports = {
  calculateShiftDuration,
};
