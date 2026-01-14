import bwipjs from 'bwip-js';

interface PaymentData {
  amount: number;
  orderId: string;
  userMeta: {
    ime: string;
    prezime: string;
  };
}

interface BankAccountDetails {
  recipientName: string;
  recipientAddress1: string;
  recipientAddress2: string;
  iban: string;
  currency?: string;
}

function normalizeCroatian(str: string): string {
  const croatianChars: { [key: string]: string } = {
    'č': 'c',
    'ć': 'c',
    'đ': 'd',
    'š': 's',
    'ž': 'z',
    'Č': 'C',
    'Ć': 'C',
    'Đ': 'D',
    'Š': 'S',
    'Ž': 'Z',
  };

  return str.replace(/[čćđšžČĆĐŠŽ]/g, (char) => croatianChars[char] || char);
}

export function formatHUB3Data(
  data: PaymentData,
  bankDetails: BankAccountDetails,
): string {
  // Format amount: multiply by 100 to remove decimal point and ensure 2 decimal places
  const amountWithoutDecimal = Math.round(data.amount * 100).toString();

  // Get current year
  const currentYear = new Date().getFullYear();

  // Normalize payer name (for Field 14)
  const normalizedName = normalizeCroatian(
    `${data.userMeta.ime} ${data.userMeta.prezime}`,
  );

  // Format according to the HUB3 standard with PDF417 format
  // Field 12: Reference number - use only order ID (some banks expect just the number)
  // Field 13: MUST be empty (reserved field)
  // Field 14: Payer name (normalized)
  // Note: Recipient name should match EXACTLY as registered with the bank (with diacritics)
  const hub3Data = [
    'HRVHUB30',
    bankDetails.currency || 'EUR',
    amountWithoutDecimal,
    '', // Field 4: Reserved (empty - IBAN already contains country code HR)
    '',
    '',
    bankDetails.recipientName, // Use exact name as registered with bank (with diacritics)
    '', // Field 8: Address line 1 - optional (IBAN contains all necessary info)
    '', // Field 9: Address line 2 - optional (IBAN contains all necessary info)
    bankDetails.iban,
    'HR00',
    data.orderId, // Field 12: Reference number - just order ID (no prefix)
    '', // Field 13: MUST be empty according to HUB3 spec
    normalizedName, // Field 14: Payer name (normalized Croatian characters) - used as payment description
    '',
    '',
  ].join('\n');

  // Debug: log the HUB3 data (remove in production if needed)
  console.log('HUB3 Data:', hub3Data.split('\n'));

  return hub3Data;
}

export async function generatePDF417(
  data: PaymentData,
  bankDetails: BankAccountDetails,
): Promise<string> {
  try {
    // Generate the barcode
    const png = await bwipjs.toBuffer({
      bcid: 'pdf417',
      text: formatHUB3Data(data, bankDetails),
      scale: 5,
      height: 14,
      includetext: false,
      textxalign: 'center',
    });

    // Convert to base64 for displaying in browser
    return `data:image/png;base64,${png.toString('base64')}`;
  } catch (error) {
    console.error('Error generating barcode:', error);
    throw error;
  }
}
