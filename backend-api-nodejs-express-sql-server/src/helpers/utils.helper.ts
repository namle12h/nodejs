// src/helpers/utils.helper.ts
export const stringToBoolean = (value: string | undefined): boolean | undefined => {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return undefined; // Trả về undefined nếu giá trị không phải 'true' hoặc 'false'
};