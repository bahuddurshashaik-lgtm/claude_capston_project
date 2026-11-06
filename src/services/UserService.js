// HB-004: User Authentication and Profiles - Service Layer

const User = require('../models/User');

class UserService {
  constructor() {
    this.users = [];
    this.nextId = 1;
  }

  // Register new user
  register(userData) {
    // Validate email
    if (!User.validateEmail(userData.email)) {
      return { success: false, error: 'Invalid email format' };
    }

    // Check if email already exists
    if (this.users.find(u => u.email === userData.email)) {
      return { success: false, error: 'Email already registered' };
    }

    // Validate password
    const passwordValidation = User.validatePassword(userData.password);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.error };
    }

    // Hash password
    const hashedPassword = User.hashPassword(userData.password);

    // Create user
    const user = new User(
      this.nextId++,
      userData.email,
      hashedPassword,
      userData.firstName,
      userData.lastName,
      userData.phone
    );

    this.users.push(user);
    return { success: true, user: this.sanitizeUser(user) };
  }

  // Login user
  login(email, password) {
    const user = this.users.find(u => u.email === email);
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    const hashedPassword = User.hashPassword(password);
    if (!User.verifyPassword(password, user.password)) {
      return { success: false, error: 'Invalid credentials' };
    }

    return { success: true, user: this.sanitizeUser(user) };
  }

  // Get user by ID
  getUserById(id) {
    const user = this.users.find(u => u.id === id);
    return user ? this.sanitizeUser(user) : null;
  }

  // Update user profile
  updateProfile(userId, updates) {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    user.updateProfile(updates);
    return { success: true, user: this.sanitizeUser(user) };
  }

  // Remove password from user object
  sanitizeUser(user) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}

module.exports = UserService;
