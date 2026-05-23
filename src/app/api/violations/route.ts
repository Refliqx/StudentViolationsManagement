import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '');
const supabaseServiceKey = process.env.NEXT_PUBLIC_SECRET_ROLE_KEY || '';

// Server-side Supabase client using service_role key to bypass RLS policies
const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const { data, error } = await supabaseServer
        .from('pelanggarans')
        .select('*, siswas(*, kelas(*)), bukti_pelanggarans(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    } else {
      const { data, error } = await supabaseServer
        .from('pelanggarans')
        .select('*, siswas(*, kelas(*)), bukti_pelanggarans(*)')
        .order('tanggal', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ success: true, data: data || [] });
    }
  } catch (error: any) {
    console.error("GET /api/violations error:", error);
    return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      siswa_id,
      jenis_pelanggaran,
      tingkat,
      poin,
      tanggal,
      waktu,
      lokasi,
      deskripsi,
      status,
      tindakan,
      tanggal_tindak_lanjut,
      catatan,
      url
    } = body;

    if (!siswa_id || !jenis_pelanggaran || !tingkat || !tanggal) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Insert to pelanggarans using all fields
    const { data: insertedViolation, error: insertError } = await supabaseServer
      .from('pelanggarans')
      .insert([{
        id_siswa: siswa_id,
        jenis_pelanggaran,
        tingkat,
        poin: poin || 0,
        tanggal,
        waktu: waktu || null,
        lokasi: lokasi || null,
        deskripsi: deskripsi || null,
        status: status || 'Aktif',
        tindakan: tindakan || null,
        tanggal_tindak_lanjut: tanggal_tindak_lanjut || null,
        catatan: catatan || null
      }])
      .select()
      .single();

    if (insertError) throw insertError;

    // If an evidence URL is provided, insert to bukti_pelanggarans
    if (url) {
      const { error: proofError } = await supabaseServer
        .from('bukti_pelanggarans')
        .insert([{
          id_pelanggaran: insertedViolation.id,
          url_foto: url
        }]);
      if (proofError) throw proofError;
    }

    // Fetch the complete populated record
    const { data: finalData, error: finalError } = await supabaseServer
      .from('pelanggarans')
      .select('*, siswas(*, kelas(*)), bukti_pelanggarans(*)')
      .eq('id', insertedViolation.id)
      .single();

    if (finalError) throw finalError;

    return NextResponse.json({ success: true, data: finalData });
  } catch (error: any) {
    console.error("POST /api/violations error:", error);
    return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      siswa_id,
      jenis_pelanggaran,
      tingkat,
      poin,
      tanggal,
      waktu,
      lokasi,
      deskripsi,
      status,
      tindakan,
      tanggal_tindak_lanjut,
      catatan,
      url
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing violation ID' }, { status: 400 });
    }

    const { error: updateError } = await supabaseServer
      .from('pelanggarans')
      .update({
        id_siswa: siswa_id,
        jenis_pelanggaran,
        tingkat,
        poin,
        tanggal,
        waktu: waktu || null,
        lokasi: lokasi || null,
        deskripsi: deskripsi || null,
        status,
        tindakan: tindakan || null,
        tanggal_tindak_lanjut: tanggal_tindak_lanjut || null,
        catatan: catatan || null
      })
      .eq('id', id);

    if (updateError) throw updateError;

    if (url !== undefined) {
      const { error: deleteProofError } = await supabaseServer
        .from('bukti_pelanggarans')
        .delete()
        .eq('id_pelanggaran', id);
      
      if (deleteProofError) throw deleteProofError;

      if (url) {
        const { error: proofError } = await supabaseServer
          .from('bukti_pelanggarans')
          .insert([{
            id_pelanggaran: id,
            url_foto: url
          }]);
        if (proofError) throw proofError;
      }
    }

    // Fetch the complete populated record after update
    const { data: finalData, error: finalError } = await supabaseServer
      .from('pelanggarans')
      .select('*, siswas(*, kelas(*)), bukti_pelanggarans(*)')
      .eq('id', id)
      .single();

    if (finalError) throw finalError;

    return NextResponse.json({ success: true, data: finalData });
  } catch (error: any) {
    console.error("PATCH /api/violations error:", error);
    return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing violation ID' }, { status: 400 });
    }

    // First delete dependent evidence photos
    await supabaseServer
      .from('bukti_pelanggarans')
      .delete()
      .eq('id_pelanggaran', id);

    // Then delete the violation itself
    const { error } = await supabaseServer
      .from('pelanggarans')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/violations error:", error);
    return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 });
  }
}
