import crypto from 'crypto';

function generateToken(length = 5): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'; // Character set
  let token = '';
  while (token.length < length) {
    const randomBytes = crypto.randomBytes(1);
    const randomChar = charset.charAt(randomBytes[0] % charset.length);
    
    if (token.length === 0 && /\d/.test(randomChar)) { 
      token += randomChar; // First character must be a digit
    } else if (token.length === 1 && /\d/.test(randomChar)) {
      token += randomChar; // Second character must be a digit
    } else if (token.length === 2 && /[a-z]/.test(randomChar)) {
      token += randomChar; // Third character must be lowercase
    } else if (token.length === 3 && /[A-Z]/.test(randomChar)) {
      token += randomChar; // Fourth character must be uppercase
    } else if (token.length === 4 && /[^a-zA-Z0-9]/.test(randomChar)) { 
      token += randomChar; // Fifth character must be a special character
    }
  }

  return token;
}

export default generateToken;
