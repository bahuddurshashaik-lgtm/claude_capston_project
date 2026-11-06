// Unit tests for HB-004: User Service

const UserService = require('../../src/services/UserService');

describe('UserService - HB-004', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('register', () => {
    test('should register valid user', () => {
      const result = userService.register({
        email: 'test@example.com',
        password: 'SecurePass123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '555-0101'
      });

      expect(result.success).toBe(true);
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.password).toBeUndefined(); // sanitized
    });

    test('should reject invalid email', () => {
      const result = userService.register({
        email: 'invalid-email',
        password: 'SecurePass123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '555-0101'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('email');
    });

    test('should reject duplicate email', () => {
      userService.register({
        email: 'duplicate@example.com',
        password: 'SecurePass123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '555-0101'
      });

      const result = userService.register({
        email: 'duplicate@example.com',
        password: 'AnotherPass123',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '555-0102'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('already registered');
    });

    test('should reject weak password', () => {
      const result = userService.register({
        email: 'test@example.com',
        password: 'weak',
        firstName: 'John',
        lastName: 'Doe',
        phone: '555-0101'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('login', () => {
    beforeEach(() => {
      userService.register({
        email: 'login@example.com',
        password: 'LoginPass123',
        firstName: 'Test',
        lastName: 'User',
        phone: '555-0101'
      });
    });

    test('should login with correct credentials', () => {
      const result = userService.login('login@example.com', 'LoginPass123');

      expect(result.success).toBe(true);
      expect(result.user.email).toBe('login@example.com');
    });

    test('should reject non-existent user', () => {
      const result = userService.login('nonexistent@example.com', 'Password123');

      expect(result.success).toBe(false);
      expect(result.error).toContain('credentials');
    });

    test('should reject incorrect password', () => {
      const result = userService.login('login@example.com', 'WrongPassword123');

      expect(result.success).toBe(false);
      expect(result.error).toContain('credentials');
    });
  });

  describe('getUserById', () => {
    test('should return user by id', () => {
      const registerResult = userService.register({
        email: 'getuser@example.com',
        password: 'GetUser123',
        firstName: 'Get',
        lastName: 'User',
        phone: '555-0101'
      });

      const user = userService.getUserById(registerResult.user.id);

      expect(user).toBeDefined();
      expect(user.email).toBe('getuser@example.com');
      expect(user.password).toBeUndefined(); // sanitized
    });

    test('should return null for non-existent user', () => {
      const user = userService.getUserById(999);

      expect(user).toBeNull();
    });
  });

  describe('updateProfile', () => {
    let userId;

    beforeEach(() => {
      const result = userService.register({
        email: 'update@example.com',
        password: 'UpdatePass123',
        firstName: 'Original',
        lastName: 'Name',
        phone: '555-0000'
      });
      userId = result.user.id;
    });

    test('should update firstName', () => {
      const result = userService.updateProfile(userId, {
        firstName: 'Updated'
      });

      expect(result.success).toBe(true);
      expect(result.user.firstName).toBe('Updated');
      expect(result.user.lastName).toBe('Name'); // unchanged
    });

    test('should update lastName', () => {
      const result = userService.updateProfile(userId, {
        lastName: 'NewName'
      });

      expect(result.success).toBe(true);
      expect(result.user.lastName).toBe('NewName');
    });

    test('should update phone', () => {
      const result = userService.updateProfile(userId, {
        phone: '555-9999'
      });

      expect(result.success).toBe(true);
      expect(result.user.phone).toBe('555-9999');
    });

    test('should update multiple fields', () => {
      const result = userService.updateProfile(userId, {
        firstName: 'New',
        lastName: 'User',
        phone: '555-8888'
      });

      expect(result.success).toBe(true);
      expect(result.user.firstName).toBe('New');
      expect(result.user.lastName).toBe('User');
      expect(result.user.phone).toBe('555-8888');
    });

    test('should return error for non-existent user', () => {
      const result = userService.updateProfile(999, {
        firstName: 'Updated'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });
});
