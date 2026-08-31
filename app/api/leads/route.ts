import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, company, email } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!company || typeof company !== 'string' || company.trim() === '') {
      return NextResponse.json({ error: 'Company is required' }, { status: 400 });
    }

    const lead = await prisma.resumeDownloadLead.create({
      data: {
        name: name.trim(),
        company: company.trim(),
        email: email && typeof email === 'string' ? email.trim() : null,
      },
    });

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
  } catch (error) {
    console.error('Failed to save lead:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
