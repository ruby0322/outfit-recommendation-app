"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const SubmitButton = () => {
  const router = useRouter();
  const handleSubmit = async () => {
    /* TODO: Submit Handler */
    /* INFO: Submission details should be passed down from parent. */
    const recommendationId = "example_id";
    /* INFO: Recommendation ID should be retrieved from DB after generating recommendation. */
    router.push(`/recommendation/${recommendationId}`);
  };
  return <Button onClick={handleSubmit}>一鍵成為穿搭達人！</Button>;
};

export default SubmitButton;
