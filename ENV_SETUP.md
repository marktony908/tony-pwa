# Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"

# M-Pesa API Configuration
# Get these credentials from https://developer.safaricom.co.ke/
# All payments will go to Abdallah Abdul's number: 254768209816
MPESA_CONSUMER_KEY="your_mpesa_consumer_key_here"
MPESA_CONSUMER_SECRET="your_mpesa_consumer_secret_here"
MPESA_PASSKEY="your_mpesa_passkey_here"
# Use Abdallah's number as the shortcode (or your M-Pesa business shortcode if different)
MPESA_SHORTCODE="254768209816"

# M-Pesa Environment
# For testing (Sandbox):
MPESA_BASE_URL="https://sandbox.safaricom.co.ke"
# For production (Live):
# MPESA_BASE_URL="https://api.safaricom.co.ke"

# M-Pesa Callback URL
# For local development:
MPESA_CALLBACK_URL="http://localhost:3000/api/payments/mpesa/callback"
# For production, replace with your domain:
# MPESA_CALLBACK_URL="https://yourdomain.com/api/payments/mpesa/callback"

# Email Configuration (SMTP)
# For Gmail:
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
# Note: For Gmail, you need to use an "App Password" not your regular password
# Generate one at: https://myaccount.google.com/apppasswords

# For other email providers (e.g., SendGrid, Mailgun, etc.):
# SMTP_HOST="smtp.sendgrid.net"
# SMTP_PORT="587"
# SMTP_SECURE="false"
# SMTP_USER="apikey"
# SMTP_PASSWORD="your-sendgrid-api-key"
```

## How to Get M-Pesa API Credentials

1. **Register/Login** at [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. **Create an App** to get Consumer Key and Consumer Secret
3. **Get Passkey and Shortcode** from your M-Pesa Business Account
4. **Configure Callback URL** in your M-Pesa developer dashboard

## Important Notes

- **Sandbox Mode**: Use sandbox credentials for testing
- **Production Mode**: Switch to production credentials and base URL when going live
- **Callback URL**: Must be publicly accessible (use ngrok for local testing)
- **Business Number**: The system uses Abdallah's number (254768209816) as configured

## Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password at [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Use the App Password as `SMTP_PASSWORD` (not your regular password)

### Other Email Providers
- **SendGrid**: Use `smtp.sendgrid.net` with port 587
- **Mailgun**: Use `smtp.mailgun.org` with port 587
- **AWS SES**: Use your SES SMTP endpoint
- **Custom SMTP**: Configure according to your provider's settings

### Development Mode
If email is not configured, the system will log email actions to the console instead of sending actual emails. This is useful for development and testing.

## Security

- Never commit `.env` file to version control
- Keep your credentials secure
- Rotate credentials regularly
- Use different credentials for development and production
- For email, use App Passwords or API keys, never use your main account password

