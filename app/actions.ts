'use server';

import { s3Client } from '@/lib/s3client';
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';

export async function uploadImage(formData: FormData) {
  const image = formData.get('image') as File;

  if (!image.size) {
    return {
      success: false,
      message: 'Você precisa enviar algum arquivo.',
    };
  }

  if (!image.type.startsWith('image/')) {
    return {
      success: false,
      message: 'Formato inválido. Envie uma imagem',
    };
  }

  if (image.size > 2 * 1024 * 1024) {
    return {
      success: false,
      message: 'Arquivo muito grande (>2mb)',
    };
  }

  if (await tooManyImages()) {
    return {
      success: false,
      message:
        'Esta aplicação atingiu o limite de imagens. Delete alguma para prosseguir',
    };
  }

  const arrayBuffer = await image.arrayBuffer();
  const imageBuffer = Buffer.from(arrayBuffer);

  const putObjectParams = new PutObjectCommand({
    Bucket: 'codante-mp-foto-upload',
    Key: nanoid() + '.jpg',
    Body: imageBuffer,
  });

  try {
    await s3Client.send(putObjectParams);
    revalidatePath('/');
    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
      message: 'Alguma coisa deu errado.',
    };
  }
}

export async function uploadWithUppy(formData: FormData) {
  const images: File[] = formData.getAll('images') as File[];

  images.forEach((image) => {
    if (!image.size) {
      return {
        success: false,
        message: 'Você precisa enviar algum arquivo.',
      };
    }

    if (!image.type.startsWith('image/')) {
      return {
        success: false,
        message: 'Formato inválido. Envie uma imagem',
      };
    }

    if (image.size > 2 * 1024 * 1024) {
      return {
        success: false,
        message: 'Arquivo muito grande (>2mb)',
      };
    }
  });

  if (await tooManyImages()) {
    return {
      success: false,
      message:
        'Esta aplicação atingiu o limite de imagens. Delete alguma para prosseguir',
    };
  }

  const promises = images.map(async (image) => {
    const arrayBuffer = await image.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
    const putObjectParams = new PutObjectCommand({
      Bucket: 'codante-mp-foto-upload',
      Key: nanoid() + '.jpg',
      Body: imageBuffer,
    });

    return s3Client.send(putObjectParams);
  });

  await Promise.all(promises);
  revalidatePath('/')

  return {
    success: true,
  }
}

async function tooManyImages() {
  const listObjectsParams = new ListObjectsV2Command({
    Bucket: 'codante-mp-foto-upload',
  });

  const objects = await s3Client.send(listObjectsParams);

  if ((objects.Contents?.length ?? 0) > 20) {
    return true;
  } else {
    return false;
  }
}

export async function deleteImage(key: string) {
  const deleteObjectParams = new DeleteObjectCommand({
    Bucket: 'codante-mp-foto-upload',
    Key: key,
  });

  try {
    await s3Client.send(deleteObjectParams);
    revalidatePath('/');
    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
    };
  }
}
