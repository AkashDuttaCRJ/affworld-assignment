export const getResetPasswordEmailTemplate = (resetLink: string) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; padding: 30px; border-radius: 5px; box-shadow: 0px 0px 10px #dddddd;">
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <h2 style="color: #333333; margin: 0;">Reset Your Password</h2>
            </td>
          </tr>
          <tr>
            <td style="color: #666666; font-size: 16px; line-height: 1.5;">
              <p>Hello,</p>
              <p>You recently requested to reset your password. Click the button below to reset it:</p>
              <p style="text-align: center;">
                <a href="${resetLink}" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 12px 24px; font-size: 16px; border-radius: 5px;">Reset Password</a>
              </p>
              <p>If you did not request this, please ignore this email.</p>
              <p>Thanks,<br>The Support Team</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top: 20px; font-size: 14px; color: #999999;">
              <p>If you have trouble clicking the button, copy and paste this link into your browser:</p>
              <p style="word-wrap: break-word;"><a href="${resetLink}" style="color: #007bff; text-decoration: none;">${resetLink}</a></p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top: 30px; font-size: 12px; color: #999999;">
              <p>&copy; 2025 YourCompany. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
};
