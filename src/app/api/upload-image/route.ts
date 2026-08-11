import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const supabase = await createClient();

    // Ensure the bucket exists (create if not)
    const { error: bucketError } = await supabase.storage.createBucket('post-images', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      fileSizeLimit: 5242880, // 5MB
    });
    // Ignore "already exists" error
    if (bucketError && !bucketError.message.includes('already exists') && !bucketError.message.includes('Duplicate')) {
      console.warn('Bucket creation warning:', bucketError.message);
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const fileName = `${Date.now()}-${safeName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { data, error } = await supabase.storage
      .from('post-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage
      .from('post-images')
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl });
  } catch (e: any) {
    console.error('Image upload error:', e);
    return NextResponse.json({ error: 'Upload failed: ' + e.message }, { status: 500 });
  }
}
