import { sendEmail } from "../utils/email.mjs";

export const sendChatEmail = async (req, res) => {
  try {
    const { toEmail, senderName, messagePreview } = req.body;

    if (!toEmail || !senderName || !messagePreview) {
      return res.status(400).json({ error: "Missing fields" });
    }

    await sendEmail({
      to: toEmail,
      subject: `New message from ${senderName}`,
      html: `
        <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>New Message</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f4f4">
      <tr>
        <td align="center" style="padding:40px 0;">
          <table width="600" border="0" cellspacing="0" cellpadding="0" 
            style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

            <!-- HEADER -->
            <tr>
              <td align="center" bgcolor="#A321A6" style="padding:20px;">
                <h1 style="color:#ffffff; margin:0; font-size:24px;">Ghouraf Message Alert</h1>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:30px; color:#333333; font-size:16px; line-height:1.5;">
                <p>Hi <b>${receiverFirstName}</b>,</p>

                <p><strong>${senderName}</strong> sent you a new message:</p>

                <p style="margin-top:15px; padding:12px 15px; background:#f4f4f4; border-radius:6px;">
                  ${messagePreview}
                </p>

                <p style="margin-top:25px;">Click below to view and reply:</p>

                <a href="${process.env.FRONTEND_URL}/user/messages" 
                  style="
                    display:inline-block;
                    padding:12px 20px;
                    background:#A321A6;
                    color:white;
                    text-decoration:none;
                    border-radius:6px;
                    font-weight:bold;
                    margin-top:10px;
                  ">
                  Open Chat
                </a>

                <p style="margin-top:30px;">If you have any questions, feel free to contact support.</p>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td align="center" bgcolor="#f4f4f4" style="padding:15px; font-size:12px; color:#666;">
                Ghouraf. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Email failed" });
  }
};
