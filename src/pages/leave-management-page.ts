import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class LeavePage extends BasePage {
  // Locators
  readonly leaveHeader: Locator;
  readonly applyLeaveButton: Locator;
  readonly myLeaveTab: Locator;
  readonly entitlementsTab: Locator;
  readonly reportsTab: Locator;
  readonly configureTab: Locator;
  readonly leaveListTab: Locator;
  readonly assignLeaveTab: Locator;
  readonly leaveTypeDropdown: Locator;
  readonly fromDatePicker: Locator;
  readonly toDatePicker: Locator;
  readonly commentsTextarea: Locator;
  readonly applyButton: Locator;

  constructor(page: Page) {
    super(page);
    this.leaveHeader = page.locator('h6:has-text("Leave")');
    this.applyLeaveButton = page.locator('button:has-text("Apply")');
    this.myLeaveTab = page.locator('a:has-text("My Leave")');
    this.entitlementsTab = page.locator('a:has-text("Entitlements")');
    this.reportsTab = page.locator('a:has-text("Reports")');
    this.configureTab = page.locator('a:has-text("Configure")');
    this.leaveListTab = page.locator('a:has-text("Leave List")');
    this.assignLeaveTab = page.locator('a:has-text("Assign Leave")');
    this.leaveTypeDropdown = page.locator('.oxd-select-text').first();
    this.fromDatePicker = page.locator('input[placeholder="yyyy-dd-mm"]').first();
    this.toDatePicker = page.locator('input[placeholder="yyyy-dd-mm"]').nth(1);
    this.commentsTextarea = page.locator('textarea');
    this.applyButton = page.locator('button[type="submit"]');
  }

  // Methods
  async applyLeave(leaveType: string, fromDate: string, toDate: string, comments?: string): Promise<void> {
    await this.leaveTypeDropdown.click();
    await this.page.locator(`text=${leaveType}`).click();
    await this.fromDatePicker.fill(fromDate);
    await this.toDatePicker.fill(toDate);
    
    if (comments) {
      await this.commentsTextarea.fill(comments);
    }
    
    await this.applyButton.click();
  }

  async navigateToMyLeave(): Promise<void> {
    await this.myLeaveTab.click();
  }

  async navigateToLeaveList(): Promise<void> {
    await this.leaveListTab.click();
  }

  async getLeaveBalance(): Promise<string[]> {
    const balances = await this.page.locator('.leave-balance-text').allTextContents();
    return balances;
  }
}

// ============================================================================
// 7. TIME TRACKING PAGE OBJECT
// ============================================================================

export class TimePage extends BasePage {
  // Locators
  readonly timeHeader: Locator;
  readonly timesheetsTab: Locator;
  readonly attendanceTab: Locator;
  readonly reportsTab: Locator;
  readonly projectInfoTab: Locator;
  readonly myTimesheetButton: Locator;
  readonly employeeTimesheetButton: Locator;
  readonly punchInButton: Locator;
  readonly punchOutButton: Locator;
  readonly punchInTime: Locator;
  readonly punchOutTime: Locator;
  readonly attendanceRecords: Locator;

  constructor(page: Page) {
    super(page);
    this.timeHeader = page.locator('h6:has-text("Time")');
    this.timesheetsTab = page.locator('a:has-text("Timesheets")');
    this.attendanceTab = page.locator('a:has-text("Attendance")');
    this.reportsTab = page.locator('a:has-text("Reports")');
    this.projectInfoTab = page.locator('a:has-text("Project Info")');
    this.myTimesheetButton = page.locator('button:has-text("My Timesheet")');
    this.employeeTimesheetButton = page.locator('button:has-text("Employee Timesheet")');
    this.punchInButton = page.locator('button:has-text("Punch In")');
    this.punchOutButton = page.locator('button:has-text("Punch Out")');
    this.punchInTime = page.locator('.punch-time-container .time');
    this.punchOutTime = page.locator('.punch-time-container .time').nth(1);
    this.attendanceRecords = page.locator('.attendance-records');
  }

  // Methods
  async punchIn(): Promise<void> {
    await this.punchInButton.click();
  }

  async punchOut(): Promise<void> {
    await this.punchOutButton.click();
  }

  async getPunchInTime(): Promise<string> {
    return await this.punchInTime.textContent() || '';
  }

  async getPunchOutTime(): Promise<string> {
    return await this.punchOutTime.textContent() || '';
  }

  async navigateToMyTimesheet(): Promise<void> {
    await this.myTimesheetButton.click();
  }

  async navigateToAttendance(): Promise<void> {
    await this.attendanceTab.click();
  }
}