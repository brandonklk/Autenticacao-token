import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";

let clientTransporter = undefined;

class SendMailService {

      constructor() {

        nodemailer.createTestAccount().then((account) => {
          const transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
              user: account.user,
              pass: account.pass,
            },
          });
      
          clientTransporter = transporter;
        });
      }

    async execute(to, subject, variables, path) {
      const templateFileContent = fs.readFileSync(path).toString("utf8");
    
      const mailTemplateParse = handlebars.compile(templateFileContent);
    
      const html = mailTemplateParse(variables);
    
      const message = await clientTransporter.sendMail({
        to,
        subject,
        html,
        from: "Token <noreplay@a.com.br>",
      });
    
      console.log("Message sent: %s", message.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
      return nodemailer.getTestMessageUrl(message);
    }
}

export default new SendMailService();