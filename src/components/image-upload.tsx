'use client';

import { UploadDropzone } from '@/lib/uploadthing';
import { XIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  onChange: (url: string) => void;
  value: string;
  endpoint: 'postImage';
}

function ImageUpload({ onChange, value, endpoint }: ImageUploadProps) {
  if (value) {
    return (
      <div className="relative size-40">
        <Image src={value} fill alt="Upload" className="size-40 rounded-md object-cover" />
        <button onClick={() => onChange('')} className="absolute top-0 right-0 rounded-full bg-red-500 p-1 shadow-sm" type="button">
          <XIcon className="h-4 w-4 text-white" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.ufsUrl || '');
      }}
      onUploadError={(error: Error) => console.log(error)}
      endpoint={endpoint}
    />
  );
}

export default ImageUpload;
