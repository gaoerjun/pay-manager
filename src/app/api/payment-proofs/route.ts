import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET () {
  try {
    const proofs = db.prepare(`
      SELECT 
        id,
        image,
        created_at as createdAt
      FROM payment_proofs 
      ORDER BY created_at DESC
    `).all();

    return NextResponse.json(proofs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch proofs' }, { status: 500 });
  }
}

export async function POST (request: Request) {
  try {
    const body = await request.json();
    const { image } = body;

    const insertProof = db.prepare(`
      INSERT INTO payment_proofs (image)
      VALUES (?)
    `);

    const result = insertProof.run(image);

    return NextResponse.json({
      id: result.lastInsertRowid,
      image,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create proof' }, { status: 500 });
  }
}

export async function DELETE (request: Request) {
  try {
    const { id } = await request.json();

    const deleteProof = db.prepare('DELETE FROM payment_proofs WHERE id = ?');
    deleteProof.run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting payment proof:', error);
    return NextResponse.json(
      { error: 'Failed to delete payment proof' },
      { status: 500 }
    );
  }
}