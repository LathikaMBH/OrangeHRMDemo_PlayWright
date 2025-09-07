export class TestData {
  static readonly BASE_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
  static readonly VALID_USERNAME = 'Admin';
  static readonly VALID_PASSWORD = 'admin123';
  static readonly INVALID_USERNAME = 'InvalidUser';
  static readonly INVALID_PASSWORD = 'wrongpassword';
  
  static readonly EMPLOYEE_DATA = {
    firstName: 'John',
    middleName: 'Michael',
    lastName: 'Doe',
    employeeId: 'EMP001'
  };

  static readonly USER_DATA = {
    username: 'testuser123',
    password: 'Test@123',
    userRole: 'ESS',
    status: 'Enabled'
  };

  static readonly LEAVE_DATA = {
    leaveType: 'CAN - Personal',
    fromDate: '2024-12-01',
    toDate: '2024-12-03',
    comments: 'Family vacation'
  };
}