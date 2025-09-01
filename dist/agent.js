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
exports.TestAutomationAgent = void 0;
var sdk_1 = require("@anthropic-ai/sdk");
var test_analyzer_1 = require("./analyzers/test-analyzer");
var test_generator_1 = require("./generators/test-generator");
var github_integration_1 = require("./integrations/github-integration");
var playwright_integration_1 = require("./integrations/playwright-integration");
var TestAutomationAgent = /** @class */ (function () {
    function TestAutomationAgent() {
        this.anthropic = new sdk_1.Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
        this.testAnalyzer = new test_analyzer_1.TestAnalyzer(this.anthropic);
        this.testGenerator = new test_generator_1.TestGenerator(this.anthropic);
        this.githubIntegration = new github_integration_1.GitHubIntegration();
        this.playwrightIntegration = new playwright_integration_1.PlaywrightIntegration();
    }
    TestAutomationAgent.prototype.analyzeTestFailures = function () {
        return __awaiter(this, void 0, void 0, function () {
            var testResults, failures, analysis;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔍 Analyzing test failures...');
                        return [4 /*yield*/, this.playwrightIntegration.getLatestTestResults()];
                    case 1:
                        testResults = _a.sent();
                        failures = testResults.filter(function (result) { return result.status === 'failed'; });
                        if (failures.length === 0) {
                            return [2 /*return*/, { message: 'No test failures found!', suggestions: [] }];
                        }
                        return [4 /*yield*/, this.testAnalyzer.analyzeFailures(failures)];
                    case 2:
                        analysis = _a.sent();
                        return [2 /*return*/, analysis];
                }
            });
        });
    };
    TestAutomationAgent.prototype.generateTestsFromRequirements = function (requirements) {
        return __awaiter(this, void 0, void 0, function () {
            var existingTests, generatedTests;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🤖 Generating tests from requirements...');
                        return [4 /*yield*/, this.playwrightIntegration.getExistingTests()];
                    case 1:
                        existingTests = _a.sent();
                        return [4 /*yield*/, this.testGenerator.generateFromRequirements(requirements, existingTests)];
                    case 2:
                        generatedTests = _a.sent();
                        return [2 /*return*/, generatedTests];
                }
            });
        });
    };
    TestAutomationAgent.prototype.suggestTestImprovements = function () {
        return __awaiter(this, void 0, void 0, function () {
            var testFiles, suggestions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('💡 Analyzing tests for improvements...');
                        return [4 /*yield*/, this.playwrightIntegration.getAllTestFiles()];
                    case 1:
                        testFiles = _a.sent();
                        return [4 /*yield*/, this.testAnalyzer.suggestImprovements(testFiles)];
                    case 2:
                        suggestions = _a.sent();
                        return [2 /*return*/, suggestions];
                }
            });
        });
    };
    TestAutomationAgent.prototype.autoFixFlakyTests = function () {
        return __awaiter(this, void 0, void 0, function () {
            var flakyTests, fixes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔧 Identifying and fixing flaky tests...');
                        return [4 /*yield*/, this.testAnalyzer.identifyFlakyTests()];
                    case 1:
                        flakyTests = _a.sent();
                        return [4 /*yield*/, this.testGenerator.generateFlakinessFixes(flakyTests)];
                    case 2:
                        fixes = _a.sent();
                        return [2 /*return*/, fixes];
                }
            });
        });
    };
    return TestAutomationAgent;
}());
exports.TestAutomationAgent = TestAutomationAgent;
