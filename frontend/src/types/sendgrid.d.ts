declare module '@sendgrid/mail' {
  interface MailDataRequired {
    to: string;
    from: string;
    subject: string;
    html: string;
  }

  interface MailDataOptional {
    text?: string;
    templateId?: string;
    dynamicTemplateData?: Record<string, any>;
  }

  type MailData = MailDataRequired & MailDataOptional;

  interface SendGridMail {
    setApiKey(apiKey: string): void;
    send(data: MailData): Promise<[any, any]>;
  }

  const mail: SendGridMail;
  export = mail;
} 