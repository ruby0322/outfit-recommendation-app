"use server";
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

const bruteForceAction = async (recommendationId: number) => {
  try {
    const suggestions = await prisma.suggestion.findMany({
      where: { recommendation_id: recommendationId },
      select: { id: true },
    });
    const suggestionIds = suggestions.map((s) => s.id);

    await prisma.result.deleteMany({
      where: { suggestion_id: { in: suggestionIds } },
    });

    await prisma.suggestion.deleteMany({
      where: { id: { in: suggestionIds } },
    });

    const recommendation = await prisma.recommendation.findUnique({
      where: { id: recommendationId },
      select: { param_id: true, upload_id: true },
    });

    if (!recommendation) {
      console.error("Recommendation not found");
      return;
    }
    const { param_id: paramId, upload_id: uploadId } = recommendation;

    await prisma.recommendation.delete({
      where: { id: recommendationId },
    });
    if(paramId && uploadId){
      await deleteParamById(paramId);
      await deleteUploadById(uploadId);
    }

    // console.log(`Brute force action completed for recommendation ID: ${recommendationId}`);
    return;
  } catch (error) {
    console.error("Error in bruteForceAction:", error);
  }
};



export { deleteParamById, deleteUploadById, bruteForceAction };
