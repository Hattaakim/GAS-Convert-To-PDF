#GAS-Convert-To-PDF
A simple Google Apps Script script that converts Office files (Word, PowerPoint, Excel) to *.PDF files. This script is written in the JavaScript programming language and runs directly on the Google Apps Script server. This script doesn't run on its own; instead, it is invoked by a form (Google Form) filled out by the user (attaching their email address and the file to be converted). The conversion results are sent to each user's email address.

How It Works:
1. Users log in to a Google Form.
2. On the Google Forms page, users are required to submit an email address and attach at least one (1) Office file (PowerPoint, Word, or Excel).
3. Additional file upload requirements include a maximum of five files with a total size of 100MB.
4. Once all form requirements have been met (email address and the file to be converted), press the submit button as usual.
5. Users are asked to check their email inbox (including their spam inbox) to see the results.
6. If the conversion is successful, an email will contain a thank you message along with the converted file (as an attachment).
7. If the conversion fails, an apology will be sent via email along with an easy-to-read error code.

Additional Notes (for users):
1. If the developer created this application using a regular Google account (not a workspace account), the possibility of failure due to timeouts is greater. This is especially true if users using the free service send large or multiple document files.
