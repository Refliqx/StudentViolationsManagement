import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }
    
    // Create public/uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Create unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileExt = path.extname(file.name) || '.jpg';
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 100000)}${fileExt}`;
    const filePath = path.join(uploadsDir, fileName);
    
    // Write buffer to file
    fs.writeFileSync(filePath, buffer);
    
    // Return relative url path
    const fileUrl = `/uploads/${fileName}`;
    
    return NextResponse.json({
      success: true,
      url: fileUrl
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
