"user server";
import prisma from '@/prisma/db';

const deleteParamById = async (paramId: number) => {
  await prisma.param.delete({
    where: {
      id: paramId,
    },
  });
  return;
};

const deleteUploadById = async (uploadId: number) => {
  await prisma.upload.delete({
    where: {
      id: uploadId,
    },
  });
  return;
};

export { deleteParamById, deleteUploadById };
