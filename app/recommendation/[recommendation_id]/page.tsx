"use server";

import { getRecommendationRecordById } from "@/actions/recommendation";
import { Recommendation } from "@/type";
import FeedbackCard from "./feedback-card";
import ItemList from "./item-list";
import UserInfoCard from "./user-info-card";

const RecommendationPage = async ({
  params,
}: {
  params: { recommendation_id: number };
}) => {
  /* TODO: Fetch recommendation result with `recommendation_id` */
  // const recommendation: Recommendation = EXAMPLE_RECOMMENDATION;
  const recommendation: Recommendation = (await getRecommendationRecordById(
    params.recommendation_id
  )) as Recommendation;
  /* END TODO */
  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <div className='py-10 w-full flex flex-col items-center justify-center bg-muted'>
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
        {/* <div className='flex gap-4 w-fit items-center justify-center'>
          {Object.keys(recommendation.items).map((recommendedStyle, index) => {
            return (
              <Button key={`recommended-style-${index}`} asChild variant='link'>
                <Link href={`#${recommendedStyle}`}>{recommendedStyle}</Link>
              </Button>
            );
          })}
        </div> */}
      </div>
      <div className='flex flex-col gap-4 justify-center items-center'>
        {Object.keys(recommendation.items).map((recommendedStyle, index) => {
          return (
            <ItemList
              key={`recommended-style-${index}`}
              id={recommendedStyle}
              index={index}
              title={recommendedStyle}
              items={recommendation.items[recommendedStyle]}
            />
          );
        })}
        <br />
        <FeedbackCard />
      </div>
    </div>
  );
};

export default RecommendationPage;
