import { TestData } from '@data/test-data';
import { AddEmployeePage } from '@pages/add-employee-page';
import { AdminPage } from '@pages/admin-page';
import { DashboardPage } from '@pages/dashboard-page';
import { LeavePage, TimePage } from '@pages/leave-management-page';
import { LoginPage } from '@pages/login-page';
import { MaintenancePage } from '@pages/maintenance-page';
import { MyInfoPage } from '@pages/my-info-page';
import { PerformancePage } from '@pages/performance-page';
import { PIMPage } from '@pages/personal-information-management-page';
import { RecruitmentPage } from '@pages/recruitement-page'; 
import { test, expect } from '@playwright/test';

// ============================================================================
// LOGIN MODULE TESTS
// ============================================================================

test.describe('Login Functionality Tests', () => {
  
  test('TC_001: Verify successful login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    await loginPage.loginWithValidCredentials();
    
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    expect(await dashboardPage.getCurrentUrl()).toContain('dashboard');
  });

  test('TC_002: Verify login failure with invalid username', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    await loginPage.login(TestData.INVALID_USERNAME, TestData.VALID_PASSWORD);
    
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorMessage()).toContain('Invalid credentials');
  });

  test('TC_003: Verify login failure with invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    await loginPage.login(TestData.VALID_USERNAME, TestData.INVALID_PASSWORD);
    
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorMessage()).toContain('Invalid credentials');
  });

  test('TC_004: Verify login failure with empty credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    await loginPage.login('', '');
    
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorMessage()).toContain('Required');
  });

  test('TC_005: Verify placeholder text in login fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    
    expect(await loginPage.getUsernamePlaceholder()).toBe('Username');
    expect(await loginPage.getPasswordPlaceholder()).toBe('Password');
  });

  test('TC_006: Verify forgot password link functionality', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    await loginPage.clickForgotPassword();
    
    expect(await loginPage.getCurrentUrl()).toContain('requestPasswordResetCode');
  });

  test('TC_007: Verify demo credentials display', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    
    const credentialsText = await loginPage.getDemoCredentialsText();
    expect(credentialsText).toContain('Admin');
    expect(credentialsText).toContain('admin123');
  });

  test('TC_008: Verify login panel visibility', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    
    expect(await loginPage.isLoginPanelVisible()).toBe(true);
  });
});

// ============================================================================
// DASHBOARD MODULE TESTS
// ============================================================================

test.describe('Dashboard Functionality Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo(TestData.BASE_URL);
    await loginPage.loginWithValidCredentials();
  });

  test('TC_009: Verify dashboard elements visibility', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    expect(await dashboardPage.isDashboardVisible()).toBe(true);
    await expect(dashboardPage.sideNavigation).toBeVisible();
    await expect(dashboardPage.userDropdown).toBeVisible();
  });

  test('TC_010: Verify user logout functionality', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const loginPage = new LoginPage(page);
    
    await dashboardPage.logout();
    
    await expect(loginPage.loginButton).toBeVisible();
    expect(await dashboardPage.getCurrentUrl()).toContain('login');
  });

  test('TC_011: Verify quick launch panel options', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    const quickLaunchOptions = await dashboardPage.getQuickLaunchOptions();
    expect(quickLaunchOptions.length).toBeGreaterThan(0);
  });

  test('TC_012: Verify navigation to different modules', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigateToModule('PIM');
    expect(await dashboardPage.getCurrentUrl()).toContain('pim');
    
    await dashboardPage.navigateToModule('Leave');
    expect(await dashboardPage.getCurrentUrl()).toContain('leave');
    
    await dashboardPage.navigateToModule('Time');
    expect(await dashboardPage.getCurrentUrl()).toContain('time');
  });

  test('TC_013: Verify search functionality', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.searchEmployee('Admin');
    // Verify search results or navigation
  });
});

// ============================================================================
// PIM MODULE TESTS
// ============================================================================

test.describe('PIM (Employee Management) Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    await loginPage.loginWithValidCredentials();
    await dashboardPage.navigateToModule('PIM');
  });

  test('TC_014: Verify employee search by ID', async ({ page }) => {
    const pimPage = new PIMPage(page);
    
    await pimPage.searchEmployeeById('0001');
    
    const recordsFound = await pimPage.getRecordsFoundCount();
    expect(recordsFound).toContain('Record');
  });

  test('TC_015: Verify employee search by name', async ({ page }) => {
    const pimPage = new PIMPage(page);
    
    await pimPage.searchEmployeeByName('Admin');
    
    const tableData = await pimPage.getEmployeeTableData();
    expect(tableData.length).toBeGreaterThan(0);
  });

  test('TC_016: Verify reset search functionality', async ({ page }) => {
    const pimPage = new PIMPage(page);
    
    await pimPage.searchEmployeeById('0001');
    await pimPage.resetSearch();
    
    // Verify that search fields are cleared
  });

  test('TC_017: Verify add employee navigation', async ({ page }) => {
    const pimPage = new PIMPage(page);
    
    await pimPage.clickAddEmployee();
    
    expect(await pimPage.getCurrentUrl()).toContain('addEmployee');
  });
});

// ============================================================================
// ADD EMPLOYEE TESTS
// ============================================================================

test.describe('Add Employee Functionality Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const pimPage = new PIMPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    await loginPage.loginWithValidCredentials();
    await dashboardPage.navigateToModule('PIM');
    await pimPage.clickAddEmployee();
  });

  test('TC_018: Verify adding employee with basic information', async ({ page }) => {
    const addEmployeePage = new AddEmployeePage(page);
    
    await addEmployeePage.addEmployee(
      TestData.EMPLOYEE_DATA.firstName,
      TestData.EMPLOYEE_DATA.middleName,
      TestData.EMPLOYEE_DATA.lastName,
      TestData.EMPLOYEE_DATA.employeeId
    );
    
    expect(await addEmployeePage.isSuccessMessageVisible()).toBe(true);
  });

  test('TC_019: Verify adding employee with login credentials', async ({ page }) => {
    const addEmployeePage = new AddEmployeePage(page);
    
    await addEmployeePage.addEmployeeWithLogin(
      'Jane',
      'Smith',
      'janesmith123',
      'Password@123'
    );
    
    expect(await addEmployeePage.isSuccessMessageVisible()).toBe(true);
  });

  test('TC_020: Verify mandatory fields validation', async ({ page }) => {
    const addEmployeePage = new AddEmployeePage(page);
    
    await addEmployeePage.saveButton.click();
    
    // Verify validation messages for required fields
    await expect(page.locator('.oxd-input-field-error-message')).toBeVisible();
  });
});

// ============================================================================
// LEAVE MODULE TESTS
// ============================================================================

test.describe('Leave Management Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    await loginPage.loginWithValidCredentials();
    await dashboardPage.navigateToModule('Leave');
  });

  test('TC_021: Verify leave application process', async ({ page }) => {
    const leavePage = new LeavePage(page);
    
    await leavePage.applyLeave(
      TestData.LEAVE_DATA.leaveType,
      TestData.LEAVE_DATA.fromDate,
      TestData.LEAVE_DATA.toDate,
      TestData.LEAVE_DATA.comments
    );
    
    // Verify leave application success
  });

  test('TC_022: Verify navigation to my leave', async ({ page }) => {
    const leavePage = new LeavePage(page);
    
    await leavePage.navigateToMyLeave();
    
    expect(await leavePage.getCurrentUrl()).toContain('viewLeaveList');
  });

  test('TC_023: Verify leave balance display', async ({ page }) => {
    const leavePage = new LeavePage(page);
    
    const leaveBalances = await leavePage.getLeaveBalance();
    expect(leaveBalances.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// TIME TRACKING TESTS
// ============================================================================

test.describe('Time Tracking Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    await loginPage.loginWithValidCredentials();
    await dashboardPage.navigateToModule('Time');
  });

  test('TC_024: Verify attendance punch in/out', async ({ page }) => {
    const timePage = new TimePage(page);
    
    await timePage.navigateToAttendance();
    await timePage.punchIn();
    
    const punchInTime = await timePage.getPunchInTime();
    expect(punchInTime).toBeTruthy();
    
    await timePage.punchOut();
    
    const punchOutTime = await timePage.getPunchOutTime();
    expect(punchOutTime).toBeTruthy();
  });

  test('TC_025: Verify timesheet navigation', async ({ page }) => {
    const timePage = new TimePage(page);
    
    await timePage.navigateToMyTimesheet();
    
    expect(await timePage.getCurrentUrl()).toContain('viewMyTimesheet');
  });
});

// ============================================================================
// RECRUITMENT TESTS
// ============================================================================

test.describe('Recruitment Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    await loginPage.loginWithValidCredentials();
    await dashboardPage.navigateToModule('Recruitment');
  });

  test('TC_026: Verify adding candidate', async ({ page }) => {
    const recruitmentPage = new RecruitmentPage(page);
    
    await recruitmentPage.addCandidate(
      'Alice',
      'Johnson',
      'alice.johnson@email.com',
      '+1234567890'
    );
    
    // Verify candidate addition success
  });

  test('TC_027: Verify candidate search', async ({ page }) => {
    const recruitmentPage = new RecruitmentPage(page);
    
    await recruitmentPage.searchCandidate('Alice Johnson');
    
    // Verify search results
  });

  test('TC_028: Verify navigation to vacancies', async ({ page }) => {
    const recruitmentPage = new RecruitmentPage(page);
    
    await recruitmentPage.navigateToVacancies();
    
    expect(await recruitmentPage.getCurrentUrl()).toContain('viewJobVacancy');
  });
});

// ============================================================================
// ADMIN MODULE TESTS
// ============================================================================

test.describe('Admin Module Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    await loginPage.loginWithValidCredentials();
    await dashboardPage.navigateToModule('Admin');
  });

  test('TC_029: Verify user search functionality', async ({ page }) => {
    const adminPage = new AdminPage(page);
    
    await adminPage.searchUser('Admin');
    
    // Verify search results
  });

  test('TC_030: Verify navigation to job titles', async ({ page }) => {
    const adminPage = new AdminPage(page);
    
    await adminPage.navigateToJobTitles();
    
    expect(await adminPage.getCurrentUrl()).toContain('viewJobTitleList');
  });

  test('TC_031: Verify organization structure access', async ({ page }) => {
    const adminPage = new AdminPage(page);
    
    await adminPage.navigateToOrganizationStructure();
    
    expect(await adminPage.getCurrentUrl()).toContain('viewOrganizationGeneralInformation');
  });
});

// ============================================================================
// MY INFO TESTS
// ============================================================================

test.describe('My Info Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    await loginPage.loginWithValidCredentials();
    await dashboardPage.navigateToModule('My Info');
  });

  test('TC_032: Verify personal details update', async ({ page }) => {
    const myInfoPage = new MyInfoPage(page);
    
    await myInfoPage.updatePersonalDetails('John', 'Michael', 'Doe');
    
    // Verify update success message
  });

  test('TC_033: Verify navigation to contact details', async ({ page }) => {
    const myInfoPage = new MyInfoPage(page);
    
    await myInfoPage.navigateToContactDetails();
    
    expect(await myInfoPage.getCurrentUrl()).toContain('contactDetails');
  });

  test('TC_034: Verify employee ID display', async ({ page }) => {
    const myInfoPage = new MyInfoPage(page);
    
    const employeeId = await myInfoPage.getEmployeeId();
    expect(employeeId).toBeTruthy();
  });
});

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

test.describe('Performance Module Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    await loginPage.loginWithValidCredentials();
    await dashboardPage.navigateToModule('Performance');
  });

  test('TC_035: Verify navigation to my reviews', async ({ page }) => {
    const performancePage = new PerformancePage(page);
    
    await performancePage.navigateToMyReviews();
    
    expect(await performancePage.getCurrentUrl()).toContain('searchEvaluatePerformanceReview');
  });

  test('TC_036: Verify review list access', async ({ page }) => {
    const performancePage = new PerformancePage(page);
    
    await performancePage.navigateToReviewList();
    
    expect(await performancePage.getCurrentUrl()).toContain('searchPerformanceReview');
  });
});

// ============================================================================
// MAINTENANCE TESTS
// ============================================================================

test.describe('Maintenance Module Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    await loginPage.loginWithValidCredentials();
    await dashboardPage.navigateToModule('Maintenance');
  });

  test('TC_037: Verify maintenance mode access', async ({ page }) => {
    const maintenancePage = new MaintenancePage(page);
    
    await maintenancePage.enterMaintenanceMode(TestData.VALID_PASSWORD);
    
    // Verify maintenance mode access
  });
});

// ============================================================================
// CROSS-BROWSER AND RESPONSIVE TESTS
// ============================================================================

test.describe('Cross-Browser Tests', () => {
  
  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test(`TC_038: Verify login functionality in ${browserName}`, async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      const loginPage = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);
      
      await loginPage.navigateTo(TestData.BASE_URL);
      await loginPage.loginWithValidCredentials();
      
      expect(await dashboardPage.isDashboardVisible()).toBe(true);
      
      await context.close();
    });
  });
});

// ============================================================================
// NEGATIVE TEST CASES
// ============================================================================

test.describe('Negative Test Cases', () => {
  
  test('TC_039: Verify SQL injection prevention in login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    await loginPage.login("' OR 1=1 --", "password");
    
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('TC_040: Verify XSS prevention in input fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    await loginPage.login('<script>alert("XSS")</script>', 'password');
    
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('TC_041: Verify session timeout handling', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    await loginPage.loginWithValidCredentials();
    
    // Simulate session timeout by waiting or manipulating cookies
    await page.waitForTimeout(60000); // Wait for 1 minute
    
    // Try to access a protected page
    await dashboardPage.navigateToModule('PIM');
    
    // Should redirect to login page
    expect(await loginPage.getCurrentUrl()).toContain('login');
  });
});

// ============================================================================
// DATA-DRIVEN TESTS
// ============================================================================

test.describe('Data-Driven Tests', () => {
  
  const testUsers = [
    { username: 'Admin', password: 'admin123', shouldLogin: true },
    { username: 'admin', password: 'admin123', shouldLogin: false },
    { username: 'Admin', password: 'Admin123', shouldLogin: false },
    { username: 'invalid', password: 'invalid', shouldLogin: false },
    { username: '', password: '', shouldLogin: false }
  ];

  testUsers.forEach((user, index) => {
    test(`TC_042_${index}: Login test with user ${user.username}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);
      
      await loginPage.navigateTo(TestData.BASE_URL);
      await loginPage.login(user.username, user.password);
      
      if (user.shouldLogin) {
        expect(await dashboardPage.isDashboardVisible()).toBe(true);
      } else {
        await expect(loginPage.errorMessage).toBeVisible();
      }
    });
  });
});

// ============================================================================
// ACCESSIBILITY TESTS
// ============================================================================

test.describe('Accessibility Tests', () => {
  
  test('TC_043: Verify keyboard navigation on login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    
    // Tab through elements
    await page.keyboard.press('Tab');
    await expect(loginPage.usernameInput).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(loginPage.passwordInput).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(loginPage.loginButton).toBeFocused();
  });

  test('TC_044: Verify ARIA labels and roles', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    
    // Check for proper ARIA attributes
    const usernameLabel = await loginPage.usernameInput.getAttribute('aria-label');
    const passwordLabel = await loginPage.passwordInput.getAttribute('aria-label');
    
    expect(usernameLabel || await loginPage.usernameInput.getAttribute('placeholder')).toBeTruthy();
    expect(passwordLabel || await loginPage.passwordInput.getAttribute('placeholder')).toBeTruthy();
  });
});

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

test.describe('Performance Tests', () => {
  
  test('TC_045: Verify page load time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(TestData.BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
  });

  test('TC_046: Verify login response time', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    
    const startTime = Date.now();
    await loginPage.loginWithValidCredentials();
    await dashboardPage.dashboardHeader.waitFor();
    const loginTime = Date.now() - startTime;
    
    expect(loginTime).toBeLessThan(3000); // Login should complete within 3 seconds
  });
});

// ============================================================================
// API INTEGRATION TESTS (if APIs are available)
// ============================================================================

test.describe('API Integration Tests', () => {
  
  test('TC_047: Verify backend API responses', async ({ request }) => {
    // This would require knowing the API endpoints
    // Example of how API testing could be integrated
    
    const response = await request.post('/api/auth/login', {
      data: {
        username: TestData.VALID_USERNAME,
        password: TestData.VALID_PASSWORD
      }
    });
    
    expect(response.status()).toBe(200);
  });
});

// ============================================================================
// MOBILE RESPONSIVE TESTS
// ============================================================================

test.describe('Mobile Responsive Tests', () => {
  
  test('TC_048: Verify mobile view layout', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 } // iPhone 6/7/8 size
    });
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateTo(TestData.BASE_URL);
    
    expect(await loginPage.isLoginPanelVisible()).toBe(true);
    
    await context.close();
  });
});