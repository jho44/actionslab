# Statements Regression Tests

Statements regression test suite is run when needed by Billing Eng Team using the task **src/tasks/billing/run-statements-regression-tests.js**. Including this suite in the regular test run is not reasonable as its purpose is to indicate problems in the code against the live production data that we trust. We, Billing Eng, find it unreasonable to support fixtures for other environments since we are on the quest to deliver the new Billing Service. In the meanwhile, this tool will help us ensure the stability of the legacy billing

The task reads CSV input (**test/billing/statements-regression-tests.csv** for production) and, for every historical statement mentioned in the dataset, generates a new statement object (a.k.a. mock). Then, it compares comparable parts of the historical and the freshly generated statements to spot whether the logic hasn't been broken

It is presupposed that the CSV input contains the multitude of edge cases known to Finance. The CSV data is not a list of statement IDs but a list of monthly periods along with invoice sets and/or accounts that pose practical interest. This way/format, the list is easier to support

To run the suite locally against staging, use this command:

```
AWS_PROFILE=staging npm run chamber:exec:staging -- node src/tasks/billing/run-statements-regression-tests.js {path to your local CSV}

# or via npm command
npm run test:billing:statement-regressions:development -- {path to your local CSV}
```


To run the suite in production, use this command:

```
convox run web --app lob-api --rack lob/production "chamber exec api -- node src/tasks/billing/run-statements-regression-tests.js"

# or via npm command
npm run test:billing:statement-regressions:production
```
BEEP BEEP