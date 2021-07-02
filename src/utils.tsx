/**
 * Checks if two floats are even
 * @param {number} float1
 * @param {number} float2
 * @param {number?} precision
 */

export function areEqual(
  float1: number,
  float2: number,
  precision = 0.0001
): boolean {
  return Math.abs(float1 - float2) <= precision;
}
