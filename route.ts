// Simpan sebagai: app/api/rsvp/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'data', 'rsvp.json');

async function read() {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return [];
  }
}

export async function GET() {
  return NextResponse.json(await read());
}

export async function POST(req: Request) {
  const b = await req.json();
  const item = {
    nama: String(b.nama || '').trim().slice(0, 60),
    hadir: String(b.hadir || '').slice(0, 30),
    jumlah: Math.min(20, Math.max(1, Number(b.jumlah) || 1)),
    ucapan: String(b.ucapan || '').slice(0, 300),
    waktu: Date.now(),
  };
  if (!item.nama) return NextResponse.json({ error: 'nama wajib diisi' }, { status: 400 });

  const all = await read();
  all.unshift(item);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(all.slice(0, 500)));
  return NextResponse.json(item);
}