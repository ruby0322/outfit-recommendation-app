"use server";

import ItemList from "./item-list";

const RecommendationPage = ({
  params,
}: {
  params: { recommendation_id: string };
}) => {
  /* TODO: Recommendations Page */
  /* Fetch and render recommendation with recommendation_id */
  const recommendedItems: { [recommendedStyle: string]: string[] } = {
    "A 風格": ["商品 1", "商品 2", "商品 3"],
    "B 風格": ["商品 4", "商品 5", "商品 6"],
    "C 風格": ["商品 7", "商品 8", "商品 9"],
  };

  return (
    <div className='w-full text-center'>
      Recommendation {params.recommendation_id}
      {Object.keys(recommendedItems).map((recommendedStyle, index) => (
        <div key={`recommended-style-${index}`}>
          <h2>{recommendedStyle}</h2>
          <ItemList items={recommendedItems[recommendedStyle]} />
        </div>
      ))}
    </div>
  );
};

export default RecommendationPage;
