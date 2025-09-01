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
exports.TestGenerator = void 0;
var TestGenerator = /** @class */ (function () {
    function TestGenerator(anthropic) {
        this.anthropic = anthropic;
    }
    TestGenerator.prototype.generateFromRequirements = function (requirements, existingTests) {
        return __awaiter(this, void 0, void 0, function () {
            var prompt, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prompt = "\n      Generate Playwright TypeScript test cases for these requirements:\n      \n      ".concat(requirements, "\n      \n      Existing test patterns to follow:\n      ").concat(existingTests.slice(0, 3).join('\n---\n'), "\n      \n      Generate comprehensive test cases including:\n      - Happy path scenarios\n      - Edge cases\n      - Error conditions\n      - Accessibility tests\n      \n      Use proper Playwright TypeScript syntax with:\n      - Page Object Model patterns\n      - Proper assertions\n      - Good test descriptions\n      - Appropriate selectors\n    ");
                        return [4 /*yield*/, this.anthropic.messages.create({
                                model: 'claude-3-sonnet-20240229',
                                max_tokens: 3000,
                                messages: [{ role: 'user', content: prompt }]
                            })];
                    case 1:
                        response = _a.sent();
                        // Parse the response and extract individual test cases
                        return [2 /*return*/, this.parseGeneratedTests(response.content[0].text)];
                }
            });
        });
    };
    TestGenerator.prototype.generateFlakinessFixes = function (flakyTests) {
        return __awaiter(this, void 0, void 0, function () {
            var fixes, _i, flakyTests_1, test, prompt_1, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fixes = [];
                        _i = 0, flakyTests_1 = flakyTests;
                        _a.label = 1;
                    case 1:
                        if (!(_i < flakyTests_1.length)) return [3 /*break*/, 4];
                        test = flakyTests_1[_i];
                        prompt_1 = "\n        This Playwright test is flaky. Suggest specific fixes:\n        \n        Test: ".concat(test.name, "\n        Failure pattern: ").concat(test.failurePattern, "\n        Code: ").concat(test.code, "\n        \n        Provide specific code changes to make it more reliable.\n      ");
                        return [4 /*yield*/, this.anthropic.messages.create({
                                model: 'claude-3-sonnet-20240229',
                                max_tokens: 1000,
                                messages: [{ role: 'user', content: prompt_1 }]
                            })];
                    case 2:
                        response = _a.sent();
                        fixes.push({
                            testFile: test.file,
                            issue: test.failurePattern,
                            suggestedFix: response.content[0].text,
                            confidence: 0.8
                        });
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, fixes];
                }
            });
        });
    };
    TestGenerator.prototype.parseGeneratedTests = function (response) {
        // Extract test code blocks from the AI response
        var codeBlocks = response.match(/```typescript([\s\S]*?)```/g) || [];
        return codeBlocks.map(function (block) { return block.replace(/```typescript|```/g, '').trim(); });
    };
    return TestGenerator;
}());
exports.TestGenerator = TestGenerator;
