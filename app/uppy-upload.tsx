'use client';

import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import { useEffect, useState } from 'react';

// @ts-ignore
import pt_BR from '@uppy/locales/lib/pt_BR';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import toast from 'react-hot-toast';
import { uploadWithUppy } from './actions';
import './uppy-style.css';

export default function UppyUpload() {
  const [uppy, setUppy] = useState<Uppy | null>(null);

  useEffect(() => {
    // inicializar o uppy
    const uppy = new Uppy({ locale: pt_BR }).on('complete', async (result) => {
      const files = result.successful;
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file.data);
      });

      // chamar a action passando o formdata
      uploadWithUppy(formData).then((actionRes) => {
        console.log(actionRes);

        uppy?.cancelAll();

        if (actionRes?.success) {
          toast.success('Imagens enviadas!');
        } else {
          toast.error('Ops... ' + actionRes?.message);
        }
      });
    });

    // setar no estado
    setUppy(uppy);
  }, []);

  return (
    <div>{uppy && <Dashboard width={'100%'} height={300} uppy={uppy} />}</div>
  );
}
