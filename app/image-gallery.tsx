import { s3Client } from '@/lib/s3client';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import Image from 'next/image';
import DeleteForm from './delete-form';

export default async function ImageGallery() {
  const objectListParams = new ListObjectsV2Command({
    Bucket: 'codante-mp-foto-upload',
  });

  const objectList = await s3Client.send(objectListParams);
  objectList.Contents?.sort((a: any, b: any) => {
    return (
      new Date(b.LastModified).getTime() - new Date(a.LastModified).getTime()
    );
  });

  const imageList = objectList.Contents?.map((object) => object.Key);

  return (
    <>
      <h2 className="text-2xl font-bold text-slate-600 mb-4 mt-4">
        Galeria de Fotos
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {imageList?.map((image, index) => (
          <div
            key={index}
            className="rounded-md overflow-hidden shadow-md bg-white h-[280px] w-[280px]"
          >
            <div className="relative transition-colors group w-[90%] h-[90%] mx-auto mt-[5%]">
              <div className="absolute transition-colors group-hover:visible invisible flex items-center justify-center inset-0 group-hover:bg-gray-800 group-hover:bg-opacity-60">
                <DeleteForm imageKey={image ?? ''} />
              </div>
              <Image
                className="w-full h-full object-cover"
                width={280}
                height={280}
                src={`https://codante-mp-foto-upload.s3.sa-east-1.amazonaws.com/${image}`}
                alt="Imagem de Cachorro"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
