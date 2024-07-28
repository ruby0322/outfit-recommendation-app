"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, XIcon } from "lucide-react";
import { ChangeEvent, KeyboardEventHandler, useState } from "react";

const TagInput = ({
  tags,
  setTags,
  id,
}: {
  tags: string[];
  setTags: (x: string[]) => void;
  id: string;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isComposing, setIsComposing] = useState(false);
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "" && !isComposing) {
      e.preventDefault();
      addTag(inputValue.trim());
      setInputValue("");
    }
  };
  const addTag = (tag: string) => {
    setTags([...tags, tag]);
  };
  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };
  const clearAll = () => {
    setTags([]);
  };
  return (
    <div id={id} className='w-80 flex flex-col gap-4'>
      <div className='flex flex-wrap gap-2 flex-wrap'>
        {tags.map((tag, index) => (
          <div
            key={index}
            className='inline-flex items-center justify-center gap-2 cursor-pointer rounded-sm bg-muted px-3 py-1 text-sm font-medium text-muted-foreground'
            onClick={() => removeTag(index)}
          >
            {tag}
            <XIcon className='h-4 w-4 text-lg' />
          </div>
        ))}
        {tags.length > 0 && (
          <div
            className='inline-flex items-center justify-center gap-2 cursor-pointer rounded-sm bg-muted px-3 py-1 text-sm font-medium text-red-400 bg-red-300/40'
            onClick={clearAll}
          >
            清除
          </div>
        )}
      </div>
      <div className='relative flex items-center'>
        <Input
          type='text'
          placeholder='新增標籤'
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          className='pr-20'
        />
        <Button
          type='button'
          className='absolute right-2 h-8 w-8 text-muted-foreground hover:bg-muted'
          onClick={() => addTag(inputValue.trim())}
          disabled={inputValue.trim() === ""}
        >
          <PlusIcon className='h-4 w-4' />
          <span className='sr-only'>Add tag</span>
        </Button>
      </div>
    </div>
  );
};

export default TagInput;
