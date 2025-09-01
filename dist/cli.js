#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var inquirer_1 = require("inquirer");
var chalk_1 = require("chalk");
var ora_1 = require("ora");
var agent_1 = require("./agent");
var program = new commander_1.Command();
var agent = new agent_1.TestAutomationAgent();
program
    .name('test-ai-agent')
    .description('AI agent for your Playwright automation framework')
    .version('1.0.0');
program
    .command('analyze')
    .description('Analyze test failures and provide suggestions')
    .action(function () { return __awaiter(void 0, void 0, void 0, function () {
    var spinner, analysis, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spinner = (0, ora_1.default)('Analyzing test results...').start();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, agent.analyzeTestFailures()];
            case 2:
                analysis = _a.sent();
                spinner.succeed('Analysis complete!');
                console.log(chalk_1.default.blue('\n📊 Analysis Results:'));
                console.log(chalk_1.default.white(analysis.message));
                if (analysis.suggestions.length > 0) {
                    console.log(chalk_1.default.yellow('\n💡 Suggestions:'));
                    analysis.suggestions.forEach(function (suggestion, i) {
                        console.log(chalk_1.default.white("".concat(i + 1, ". ").concat(suggestion)));
                    });
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                spinner.fail('Analysis failed');
                console.error(chalk_1.default.red(error_1.message));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
program
    .command('generate')
    .description('Generate tests from requirements')
    .action(function () { return __awaiter(void 0, void 0, void 0, function () {
    var answers, spinner, tests, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, inquirer_1.default.prompt([
                    {
                        type: 'editor',
                        name: 'requirements',
                        message: 'Enter your requirements (this will open your default editor):',
                    }
                ])];
            case 1:
                answers = _a.sent();
                spinner = (0, ora_1.default)('Generating tests...').start();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, agent.generateTestsFromRequirements(answers.requirements)];
            case 3:
                tests = _a.sent();
                spinner.succeed("Generated ".concat(tests.length, " test cases!"));
                console.log(chalk_1.default.blue('\n🤖 Generated Tests:'));
                tests.forEach(function (test, i) {
                    console.log(chalk_1.default.gray("\n--- Test Case ".concat(i + 1, " ---")));
                    console.log(test);
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                spinner.fail('Test generation failed');
                console.error(chalk_1.default.red(error_2.message));
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
program
    .command('improve')
    .description('Suggest improvements for existing tests')
    .action(function () { return __awaiter(void 0, void 0, void 0, function () {
    var spinner, suggestions, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spinner = (0, ora_1.default)('Analyzing tests for improvements...').start();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, agent.suggestTestImprovements()];
            case 2:
                suggestions = _a.sent();
                spinner.succeed('Analysis complete!');
                console.log(chalk_1.default.blue("\n\uD83D\uDCA1 Found ".concat(suggestions.length, " improvement suggestions:")));
                suggestions.forEach(function (suggestion, i) {
                    console.log(chalk_1.default.yellow("\n".concat(i + 1, ". ").concat(suggestion.type.toUpperCase())));
                    console.log(chalk_1.default.white("   File: ".concat(suggestion.file)));
                    console.log(chalk_1.default.white("   ".concat(suggestion.description)));
                    if (suggestion.code) {
                        console.log(chalk_1.default.gray("   Suggested code:\n   ".concat(suggestion.code)));
                    }
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                spinner.fail('Analysis failed');
                console.error(chalk_1.default.red(error_3.message));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
program
    .command('fix-flaky')
    .description('Identify and suggest fixes for flaky tests')
    .action(function () { return __awaiter(void 0, void 0, void 0, function () {
    var spinner, fixes, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spinner = (0, ora_1.default)('Analyzing flaky tests...').start();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, agent.autoFixFlakyTests()];
            case 2:
                fixes = _a.sent();
                spinner.succeed('Analysis complete!');
                if (fixes.length === 0) {
                    console.log(chalk_1.default.green('\n✅ No flaky tests detected!'));
                    return [2 /*return*/];
                }
                console.log(chalk_1.default.blue("\n\uD83D\uDD27 Found ".concat(fixes.length, " potential fixes:")));
                fixes.forEach(function (fix, i) {
                    console.log(chalk_1.default.yellow("\n".concat(i + 1, ". ").concat(fix.testFile)));
                    console.log(chalk_1.default.white("   Issue: ".concat(fix.issue)));
                    console.log(chalk_1.default.white("   Confidence: ".concat(fix.confidence * 100, "%")));
                    console.log(chalk_1.default.gray("   Fix: ".concat(fix.suggestedFix)));
                });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                spinner.fail('Analysis failed');
                console.error(chalk_1.default.red(error_4.message));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
program.parse();
