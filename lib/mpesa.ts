// M-Pesa API Configuration
// All payments go to Abdallah Abdul's number: 254768209816
const MPESA_CONFIG = {
  // These should be set in environment variables
  consumerKey: process.env.MPESA_CONSUMER_KEY || '',
  consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
  passkey: process.env.MPESA_PASSKEY || '',
  // Use Abdallah's number as the shortcode/business number
  shortcode: process.env.MPESA_SHORTCODE || '254768209816',
  callbackUrl: process.env.MPESA_CALLBACK_URL || `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/payments/mpesa/callback`,
  // Abdallah's number - all payments go here
  businessNumber: '254768209816',
}

// M-Pesa API endpoints
const MPESA_BASE_URL = process.env.MPESA_BASE_URL || 'https://sandbox.safaricom.co.ke'

// Get OAuth token
export async function getMpesaAccessToken(): Promise<string> {
  try {
    const auth = Buffer.from(`${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`).toString('base64')
    
    const response = await fetch(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Error getting M-Pesa access token:', error)
    throw new Error('Failed to get M-Pesa access token')
  }
}

// Generate timestamp
function generateTimestamp(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const second = String(now.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}${hour}${minute}${second}`
}

// Generate password
function generatePassword(shortcode: string, passkey: string): string {
  const timestamp = generateTimestamp()
  const dataToEncode = `${shortcode}${passkey}${timestamp}`
  return Buffer.from(dataToEncode).toString('base64')
}

// STK Push (Lipa na M-Pesa Online)
export interface STKPushRequest {
  phoneNumber: string // Format: 254XXXXXXXXX
  amount: number
  accountReference: string
  transactionDesc: string
}

export async function initiateSTKPush(request: STKPushRequest): Promise<any> {
  try {
    const accessToken = await getMpesaAccessToken()
    const timestamp = generateTimestamp()
    const password = generatePassword(MPESA_CONFIG.shortcode, MPESA_CONFIG.passkey)

    // Format phone number (remove leading + or 0, add 254)
    let phoneNumber = request.phoneNumber.replace(/^\+/, '').replace(/^0/, '')
    if (!phoneNumber.startsWith('254')) {
      phoneNumber = `254${phoneNumber}`
    }

    const stkPushPayload = {
      BusinessShortCode: MPESA_CONFIG.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(request.amount),
      PartyA: phoneNumber, // Customer's phone number
      PartyB: MPESA_CONFIG.shortcode, // Abdallah's number (254768209816) - receives all payments
      PhoneNumber: phoneNumber, // Customer's phone number for STK Push
      CallBackURL: MPESA_CONFIG.callbackUrl,
      AccountReference: request.accountReference,
      TransactionDesc: request.transactionDesc,
    }

    const response = await fetch(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stkPushPayload),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.errorMessage || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.error('Error initiating STK Push:', error.message || error)
    throw new Error(error.message || 'Failed to initiate M-Pesa payment')
  }
}

// Query STK Push status
export async function querySTKPushStatus(checkoutRequestID: string): Promise<any> {
  try {
    const accessToken = await getMpesaAccessToken()
    const timestamp = generateTimestamp()
    const password = generatePassword(MPESA_CONFIG.shortcode, MPESA_CONFIG.passkey)

    const queryPayload = {
      BusinessShortCode: MPESA_CONFIG.shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestID,
    }

    const response = await fetch(
      `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queryPayload),
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.error('Error querying STK Push status:', error.message || error)
    throw new Error(error.message || 'Failed to query M-Pesa payment status')
  }
}

