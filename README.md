**Test Execution and Reporting**

To execute your tests, use the following command:

```sh
$ npm run test
```
- with specified tags:
```sh
$ npx playwright test --grep "@tc-01|@tc-03"
```
After running your tests, you can generate and view HTML reports with the following command:
```sh
$ npx monocart show-report test-results/index.html
```

🔍 **Slack summary report: qa-auto-pw-api**

🚀 *Branch:* dev
🛠️ *Repository:* qa-auto-pw-api

📊 **Test Results:**
   - **Total Test Cases:** 8

   ✅ **Passed:** 8
   ❌ **Failed:** 0

📋 **Details:**
   - The latest CircleCI job has been triggered manually for the dev branch of qa-auto-pw-api repository. 
   - A total of 8 test cases were executed.
   - Fortunately, all 8 test cases have passed.

🔍 **Investigation Required:**
   - Detailed analysis is needed to identify the reasons for test failures and address them accordingly.

📢 *Action Required:*
   - Team members are urged to investigate the failures promptly and take necessary actions to rectify issues.

🔗 *View Job Details:* [CircleCI Job URL]

Review The Summary:
Branch and Repository: Identify the branch and repository mentioned in the summary. This information indicates which code branch and repository the test automation was performed on.
Total Test Cases: Note the total number of test cases executed in this test run.
Test Results: Check the number of test cases that passed and failed.
Details: Read any additional information provided, such as the trigger method (manual or automatic) and any action items suggested.
Investigation Required: Pay attention to any indications of issues or failures that require investigation.

# stml-api-pw
