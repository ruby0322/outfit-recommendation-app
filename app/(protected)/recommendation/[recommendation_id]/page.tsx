"use server";

import { getRecommendationRecordById } from "@/actions/recommendation";
import ItemList from "@/components/item-list";
import { Recommendation } from "@/type";
import FeedbackCard from "./feedback-card";
import UserInfoCard from "./user-info-card";

const RecommendationPage = async ({
  params,
  searchParams,
}: {
  params: { recommendation_id: number };
  searchParams?: { [key: string]: string | undefined };
}) => {
  const recommendation: Recommendation = (await getRecommendationRecordById(
    params.recommendation_id
  )) as Recommendation;
  console.log(recommendation);
  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <div className='py-10 w-full flex flex-col items-center justify-center'>
        <h2 className='text-lg text-muted-foreground'>
          需求 #{params.recommendation_id}
        </h2>
        <UserInfoCard
          upload={recommendation.upload}
          params={recommendation.param}
        />
      </div>
      <div className='w-full flex flex-col items-center justify-center gap-8 py-8 mt-2'>
        <h2 className='text-muted-foreground'>推薦風格</h2>
      </div>
      <div className='flex flex-col gap-4 justify-center items-center md:max-w-[80vw]'>
        {Object.keys(recommendation.styles).map((recommendedStyle, index) => {
          // console.log(recommendation.styles[recommendedStyle]);
          return (
            <ItemList
              key={`recommended-style-${index}`}
              id={recommendedStyle}
              index={index}
              title={recommendedStyle}
              description={recommendation.styles[recommendedStyle].description}
              series={recommendation.styles[recommendedStyle].series}
            />
          );
        })}
      </div>
      <br />
      <FeedbackCard />
    </div>
  );
};

export default RecommendationPage;
