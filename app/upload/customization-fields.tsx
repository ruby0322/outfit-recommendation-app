"use client";

import TagInput from "@/components/tag-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";

const CustomizationFields = () => {
  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const clothingType = watch("clothingType");
  const bodyType = watch("bodyType");

  return (
    <Card className='w-128'>
      <CardHeader>
        <CardTitle>客製化參數</CardTitle>
        <CardDescription>
          讓模型知道更多資訊以提供您更精確的穿搭建議！
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-6'>
        <div className='grid gap-2'>
          <Label htmlFor='clothing-type'>我上傳的服飾是</Label>
          <div className='flex flex-wrap gap-2'>
            <Label
              htmlFor='clothing-type-upper'
              className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer ${
                clothingType === "upper" ? "bg-muted" : ""
              }`}
            >
              <input
                id='clothing-type-upper'
                type='radio'
                value='upper'
                {...register("clothingType")}
                onChange={() => setValue("clothingType", "upper")}
              />
              上衣
            </Label>
            <Label
              htmlFor='clothing-type-lower'
              className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer ${
                clothingType === "lower" ? "bg-muted" : ""
              }`}
            >
              <input
                id='clothing-type-lower'
                type='radio'
                value='lower'
                {...register("clothingType")}
                onChange={() => setValue("clothingType", "lower")}
              />
              下身
            </Label>
          </div>
          {errors.clothingType && (
            <span className='text-red-600'>
              {errors.clothingType.message?.toString()}
            </span>
          )}
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='body-type'>身型</Label>
          <div className='flex flex-wrap gap-2'>
            <Label
              htmlFor='body-type-slim'
              className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer ${
                bodyType === "slim" ? "bg-muted" : ""
              }`}
            >
              <input
                id='body-type-slim'
                type='radio'
                value='slim'
                {...register("bodyType")}
                onChange={() => setValue("bodyType", "slim")}
              />
              纖瘦
            </Label>
            <Label
              htmlFor='body-type-average'
              className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer ${
                bodyType === "average" ? "bg-muted" : ""
              }`}
            >
              <input
                id='body-type-average'
                type='radio'
                value='average'
                {...register("bodyType")}
                onChange={() => setValue("bodyType", "average")}
              />
              適中
            </Label>
            <Label
              htmlFor='body-type-athletic'
              className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer ${
                bodyType === "athletic" ? "bg-muted" : ""
              }`}
            >
              <input
                id='body-type-athletic'
                type='radio'
                value='athletic'
                {...register("bodyType")}
                onChange={() => setValue("bodyType", "athletic")}
              />
              精壯
            </Label>
            <Label
              htmlFor='body-type-curvy'
              className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer ${
                bodyType === "curvy" ? "bg-muted" : ""
              }`}
            >
              <input
                id='body-type-curvy'
                type='radio'
                value='curvy'
                {...register("bodyType")}
                onChange={() => setValue("bodyType", "curvy")}
              />
              肥胖
            </Label>
          </div>
          {errors.bodyType && (
            <span className='text-red-600'>
              {errors.bodyType.message?.toString()}
            </span>
          )}
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='height'>身高</Label>
            <Input
              id='height'
              type='number'
              placeholder='身高（公分）'
              {...register("height", { valueAsNumber: true })}
            />
            {errors.height && (
              <span className='text-red-600'>
                {errors.height.message?.toString()}
              </span>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='weight'>體重</Label>
            <Input
              id='weight'
              type='number'
              placeholder='體重（公斤）'
              {...register("weight", { valueAsNumber: true })}
            />
            {errors.weight && (
              <span className='text-red-600'>
                {errors.weight.message?.toString()}
              </span>
            )}
          </div>
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='style-preferences'>偏好風格</Label>
          <Controller
            name='stylePreferences'
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <TagInput
                tags={field.value}
                setTags={(newTags) => setValue("stylePreferences", newTags)}
                id='style-preferences'
              />
            )}
          />
          {errors.stylePreferences && (
            <span className='text-red-600'>
              {errors.stylePreferences.message?.toString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomizationFields;
