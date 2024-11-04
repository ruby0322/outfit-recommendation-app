"use server";
import prisma from '@/prisma/db';
import { handleDatabaseError } from './activity';

const deleteParamById = async (paramId: number) => {
  try {
    await prisma.param.delete({
      where: {
        id: paramId,
      },
    });
  } catch (error) {
    handleDatabaseError(error, 'deleteParamById');
  }
};

const deleteUploadById = async (uploadId: number) => {
  try {
    await prisma.upload.delete({
      where: {
        id: uploadId,
      },
    });
  } catch (error) {
    handleDatabaseError(error, 'deleteUploadById');
  }
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

    if (paramId) await deleteParamById(paramId);
    if (uploadId) await deleteUploadById(uploadId);
  } catch (error) {
    handleDatabaseError(error, 'bruteForceAction');
  }
};

export { deleteParamById, deleteUploadById, bruteForceAction };
