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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

const CustomizationFields = () => {
  /* TODO: Customization Fields */
  const [tags, setTags] = useState<string[]>([]);
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
          <RadioGroup id='clothing-type' defaultValue='average'>
            <div className='flex flex-wrap gap-2'>
              <Label
                htmlFor='clothing-type-upper'
                className='flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer [&:has(:checked)]:bg-muted'
              >
                <RadioGroupItem id='clothing-type-upper' value='upper' />
                上衣
              </Label>
              <Label
                htmlFor='clothing-type-lower'
                className='flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer [&:has(:checked)]:bg-muted'
              >
                <RadioGroupItem id='clothing-type-lower' value='lower' />
                下身
              </Label>
            </div>
          </RadioGroup>
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='body-type'>身型</Label>
          <RadioGroup id='body-type' defaultValue='average'>
            <div className='flex flex-wrap gap-2'>
              <Label
                htmlFor='body-type-slim'
                className='flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer [&:has(:checked)]:bg-muted'
              >
                <RadioGroupItem id='body-type-slim' value='slim' />
                纖瘦
              </Label>
              <Label
                htmlFor='body-type-average'
                className='flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer [&:has(:checked)]:bg-muted'
              >
                <RadioGroupItem id='body-type-average' value='average' />
                適中
              </Label>
              <Label
                htmlFor='body-type-athletic'
                className='flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer [&:has(:checked)]:bg-muted'
              >
                <RadioGroupItem id='body-type-athletic' value='athletic' />
                精壯
              </Label>
              <Label
                htmlFor='body-type-curvy'
                className='flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer [&:has(:checked)]:bg-muted'
              >
                <RadioGroupItem id='body-type-curvy' value='curvy' />
                肥胖
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='height'>身高</Label>
            <Input id='height' type='number' placeholder='身高（公分）' />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='weight'>體重</Label>
            <Input id='weight' type='number' placeholder='體重（公斤）' />
          </div>
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='style-preferences'>偏好風格</Label>
          <TagInput tags={tags} setTags={setTags} id='style-preferences' />
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomizationFields;
