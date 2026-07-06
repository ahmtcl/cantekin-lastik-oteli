export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(05)([0-9]{9})$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

export const validatePlate = (plate: string): boolean => {
  const plateRegex = /^(0[1-9]|[1-7][0-9]|8[01])[A-Z]{1,3}[0-9]{2,4}$/;
  return plateRegex.test(plate.replace(/\s/g, "").toUpperCase());
};

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");
  }
  return phone;
};

export const formatPlate = (plate: string): string => {
  return plate.replace(/\s/g, "").toUpperCase();
};
