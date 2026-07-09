// XSS Protection: Sanitize string inputs
export const sanitizeString = (str: string): string => {
  return str
    .replace(/[<>"]/g, '') // Remove potential HTML/script tags (keep apostrophe and hyphen for names)
    .trim()
    .slice(0, 500); // Limit length to prevent abuse
};

export const validateEmail = (email: string): boolean => {
  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 100;
};

export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\s/g, "");
  const phoneRegex = /^(05)([0-9]{9})$/;
  return phoneRegex.test(cleaned) && cleaned.length === 11;
};

export const validatePlate = (plate: string): boolean => {
  const cleaned = plate.replace(/\s/g, "").toUpperCase();
  const plateRegex = /^(0[1-9]|[1-7][0-9]|8[01])[A-Z]{1,3}[0-9]{2,4}$/;
  return plateRegex.test(cleaned) && cleaned.length >= 5 && cleaned.length <= 9;
};

export const validateName = (name: string): boolean => {
  const trimmed = name.trim();
  // Allow letters (including Turkish), spaces, hyphens, and apostrophes
  return trimmed.length >= 2 && trimmed.length <= 100 && /^[a-zA-ZğüşöçİĞÜŞÖÇıI\s\-']+$/.test(trimmed);
};

export const validateDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return dateObj >= today && dateObj.getFullYear() < today.getFullYear() + 2;
};

export const validateTime = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
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
