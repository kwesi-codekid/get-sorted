import nodemailer from "nodemailer";

const sendEmail = async ({
  to,
  subject,
  text = "",
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html: string;
}) => {
  // Create a transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    // host: "smtp.gmail.com", // e.g., smtp.gmail.com for Gmail
    // port: 465, // For secure SMTP use port 465
    // secure: false, // true for 465, false for other ports
    // service: "gmail",
    // auth: {
    //   user: "stanleykwaminaotabil@gmail.com",
    //   pass: "qrqq lpxc etoa avvv",
    // },

    service: "Office365",
    secure: false,
    tls: {
      ciphers: "SSLv3",
    },
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: "jkbordes@adamusgh.com",
      pass: "Duh17539",
    },

    // Increase timeout
    connectionTimeout: 1 * 60 * 1000, // 1 minute
    greetingTimeout: 30 * 1000, // 30 seconds
    socketTimeout: 1 * 60 * 1000, // 1 minute
  });

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Server is ready to take our messages");
        resolve(success);
      }
    });
  });

  // Define email options
  let mailOptions = {
    // from: '"GetSorted" jkbordes@adamusgh.com', // Sender address
    from: {
      name: "GetSorted",
      address: "jkbordes@adamusgh.com",
    },
    to: to, // List of receivers
    subject: subject, // Subject line
    text: text, // Plain text body
    html: html, // HTML body
  };

  console.log(mailOptions);

  // Send the email

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error };
  }
};

export default sendEmail;
