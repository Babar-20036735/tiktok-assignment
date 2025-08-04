// Export email services
export { sendVerificationEmail, sendWelcomeEmail } from "./services";
export type { EmailResult } from "./services";

// Export email configuration
export { createTransporter, getEmailConfig, getFromEmail } from "./config";
export type { EmailConfig } from "./config";

// Export email templates
export {
  createVerificationEmailTemplate,
  createWelcomeEmailTemplate,
} from "./templates";
