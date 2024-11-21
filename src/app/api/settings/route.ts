import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET () {
  try {
    const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get();
    return NextResponse.json({
      qrCodeImage: settings.qr_code_image,
      totalAmount: settings.total_amount
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}


export async function POST (request: Request) {
  try {
    const body = await request.json();
    const { qrCodeImage, totalAmount } = body;

    const updateSettings = db.prepare(`
      UPDATE settings 
      SET qr_code_image = ?, total_amount = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = 1
    `);

    updateSettings.run(qrCodeImage, totalAmount);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}