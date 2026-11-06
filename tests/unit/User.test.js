// Unit tests for HB-004: User Authentication and Profiles

const User = require('../../src/models/User');

describe('User Model - HB-004', () => {
  describe('User Constructor', () => {
    test('should create user with all properties', () => {
      const user = new User(1, 'test@example.com', 'hashedpass', 'John', 'Doe', '555-0101');

      expect(user.id).toBe(1);
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('hashedpass');
      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
      expect(user.phone).toBe('555-0101');
      expect(user.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('validateEmail', () => {
    test('should validate correct email formats', () => {
      expect(User.validateEmail('test@example.com')).toBe(true);
      expect(User.validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(User.validateEmail('user+tag@example.com')).toBe(true);
    });

    test('should reject invalid email formats', () => {
      expect(User.validateEmail('invalid')).toBe(false);
      expect(User.validateEmail('invalid@')).toBe(false);
      expect(User.validateEmail('@domain.com')).toBe(false);
      expect(User.validateEmail('user@')).toBe(false);
      expect(User.validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('should accept strong password', () => {
      const result = User.validatePassword('SecurePass123');

      expect(result.valid).toBe(true);
    });

    test('should reject short password', () => {
      const result = User.validatePassword('Short1');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('8 characters');
    });

    test('should reject password without uppercase', () => {
      const result = User.validatePassword('lowercase123');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('uppercase');
    });

    test('should reject password without lowercase', () => {
      const result = User.validatePassword('UPPERCASE123');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('lowercase');
    });

    test('should reject password without number', () => {
      const result = User.validatePassword('NoNumbersHere');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('number');
    });

    test('should accept password with all requirements', () => {
      const result = User.validatePassword('Abc12345');

      expect(result.valid).toBe(true);
    });
  });

  describe('hashPassword', () => {
    test('should hash password', () => {
      const hashed = User.hashPassword('MyPassword123');

      expect(hashed).toBeDefined();
      expect(hashed).not.toBe('MyPassword123');
    });

    test('should produce consistent hash for same password', () => {
      const hash1 = User.hashPassword('SamePassword123');
      const hash2 = User.hashPassword('SamePassword123');

      expect(hash1).toBe(hash2);
    });

    test('should produce different hash for different passwords', () => {
      const hash1 = User.hashPassword('Password1');
      const hash2 = User.hashPassword('Password2');

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    test('should verify correct password', () => {
      const password = 'TestPass123';
      const hashed = User.hashPassword(password);

      expect(User.verifyPassword(password, hashed)).toBe(true);
    });

    test('should reject incorrect password', () => {
      const hashed = User.hashPassword('TestPass123');

      expect(User.verifyPassword('WrongPass123', hashed)).toBe(false);
    });
  });

  describe('getFullName', () => {
    test('should return full name', () => {
      const user = new User(1, 'test@example.com', 'pass', 'John', 'Doe', '555-0101');

      expect(user.getFullName()).toBe('John Doe');
    });
  });

  describe('updateProfile', () => {
    test('should update firstName', () => {
      const user = new User(1, 'test@example.com', 'pass', 'John', 'Doe', '555-0101');
      user.updateProfile({ firstName: 'Jane' });

      expect(user.firstName).toBe('Jane');
      expect(user.lastName).toBe('Doe'); // unchanged
    });

    test('should update lastName', () => {
      const user = new User(1, 'test@example.com', 'pass', 'John', 'Doe', '555-0101');
      user.updateProfile({ lastName: 'Smith' });

      expect(user.lastName).toBe('Smith');
      expect(user.firstName).toBe('John'); // unchanged
    });

    test('should update phone', () => {
      const user = new User(1, 'test@example.com', 'pass', 'John', 'Doe', '555-0101');
      user.updateProfile({ phone: '555-9999' });

      expect(user.phone).toBe('555-9999');
    });

    test('should update multiple fields', () => {
      const user = new User(1, 'test@example.com', 'pass', 'John', 'Doe', '555-0101');
      user.updateProfile({
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '555-9999'
      });

      expect(user.firstName).toBe('Jane');
      expect(user.lastName).toBe('Smith');
      expect(user.phone).toBe('555-9999');
    });

    test('should not update with undefined values', () => {
      const user = new User(1, 'test@example.com', 'pass', 'John', 'Doe', '555-0101');
      user.updateProfile({ firstName: undefined });

      expect(user.firstName).toBe('John'); // unchanged
    });
  });
});
