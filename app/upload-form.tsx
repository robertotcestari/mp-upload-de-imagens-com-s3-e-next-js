'use client';

import toast from 'react-hot-toast';
import { uploadImage } from './actions';

export default function UploadForm() {
  async function handleSubmit(formData: FormData) {
    const actionResponse = await uploadImage(formData);

    if (actionResponse.success) {
      toast.success('Imagem enviada com sucesso.');
    } else {
      toast.error('Ops... ' + actionResponse.message ?? '');
    }
  }

  return (
    <form action={handleSubmit} className="my-8">
      <input type="file" name="image" id="image" />
      <button className="p-2 bg-slate-600 text-white rounded">
        Enviar Imagem
      </button>
    </form>
  );
}
