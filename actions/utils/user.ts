"use server";
import { ProfileTable, RecommendationPreview } from "@/type";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import prisma from "@/prisma/db";

const createProfile = async (user_id: string): Promise<boolean> => {
  const supabase = createClient();
  const existingProfile = await prisma.profile.findUnique({
    where: { user_id },
  });
  if (existingProfile) return false;

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Failed to retrieve authenticated user");
    }

    const username = user.email?.split("@")[0];

    await prisma.profile.create({
      data: {
        user_id,
        username,
        avatar_url: user.user_metadata.avatar_url || "",
      },
    });

    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create profile");
  }
};

const getProfileByUserId = async (user_id: string): Promise<ProfileTable> => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { user_id },
    });

    if (!profile) {
      throw new Error(`User with ID ${user_id} not found`);
    }

    return {
      ...profile,
      created_at: profile.created_at.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to get profile");
  }
};

const updateUserProfile = async (
  origin: string,
  username?: string,
  avatar_url?: string
): Promise<boolean> => {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Failed to retrieve authenticated user");
    }

    const updates: { username?: string; avatar_url?: string } = {};
    if (username) {
      updates.username = username;
    }
    if (avatar_url) {
      updates.avatar_url = avatar_url;
    }

    if (Object.keys(updates).length > 0) {
      await prisma.profile.update({
        where: { user_id: user.id },
        data: updates,
      });

      console.log("Profile updated successfully");
    } else {
      console.log("No valid fields to update");
    }

    revalidatePath(origin);
    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile");
  }
};

const getPreviewsByUserId = async (
  user_id: string
): Promise<RecommendationPreview[]> => {
  try {
    const recommendations = await prisma.recommendation.findMany({
      where: { user_id },
      include: {
        upload: {
          select: { image_url: true },
        },
      },
    });
    return recommendations.map(recommendation => ({
      created_at: recommendation.created_at.toISOString(),
      id: recommendation.id,
      param_id: recommendation.param_id,
      upload_id: recommendation.upload_id,
      user_id: recommendation.user_id,
      upload: recommendation.upload || null,
    })) as RecommendationPreview[];
  } catch (error) {
    console.error("Failed to get profile:", error);
    throw new Error("Error fetching recommendations");
  }
};

const signOut = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return true;
};

export {
  createProfile,
  getPreviewsByUserId,
  getProfileByUserId,
  signOut,
  updateUserProfile,
};
