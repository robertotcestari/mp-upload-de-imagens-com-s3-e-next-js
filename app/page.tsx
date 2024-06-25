import ImageGallery from './image-gallery';
import UppyUpload from './uppy-upload';

export default function Home() {
  return (
    <>
      <main className="flex-1 max-w-[900px] mx-auto px-4 py-8 text-center">
        <header>
          <h1 className="text-3xl font-black text-slate-600 mb-2">
            Foto Upload
          </h1>
          <p className="text-gray-500 mb-8 font-light">
            Galeria de fotos com Next.js, upload de imagens e S3
          </p>
        </header>

        <UppyUpload />

        {/* <UploadForm /> */}

        <hr />
        {/* Galeria de Fotos */}
        <ImageGallery />
      </main>
      <footer className="bg-slate-600 py-4 w-full"></footer>
    </>
  );
}
