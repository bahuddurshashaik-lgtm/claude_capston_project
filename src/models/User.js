// HB-004: User Authentication and Profiles - User Model

class User {
  constructor(id, email, password, firstName, lastName, phone) {
    this.id = id;
    this.email = email;
    this.password = password; // In production, should be hashed
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.createdAt = new Date();
  }

  // Validate email format
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static validatePassword(password) {
    if (password.length < 8) {
      return { valid: false, error: 'Password must be at least 8 characters' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, error: 'Password must contain uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, error: 'Password must contain lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, error: 'Password must contain a number' };
    }
    return { valid: true };
  }

  // Hash password (simple example, use bcrypt in production)
  static hashPassword(password) {
    return Buffer.from(password).toString('base64');
  }

  // Verify password
  static verifyPassword(inputPassword, hashedPassword) {
    return this.hashPassword(inputPassword) === hashedPassword;
  }

  // Get full name
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  // Update profile
  updateProfile(data) {
    if (data.firstName) this.firstName = data.firstName;
    if (data.lastName) this.lastName = data.lastName;
    if (data.phone) this.phone = data.phone;
  }
}

module.exports = User;
