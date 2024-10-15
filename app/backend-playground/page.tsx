"use server";

import { handleRecommendation, handleImageSearch, handleTextSearch } from "@/actions/upload";
import supabase from "@/lib/supabaseClient";
import { createClient } from "@/utils/supabase/client";
import { storeImageToStorage } from "@/actions/utils/insert";
import { cookies } from "next/headers";
import { getRecommendationRecordById } from "@/actions/recommendation";
import Image from "next/image"; // Import Next.js Image component

export default async function Playground(){
  // const recommendationId = await handleRecommendation(
  //   'bottom',
  //   'female',
  //   'gpt-4o-mini',
  //   '64d2474a-2ac8-4775-ab5e-2c8a31bb037c',
  //   3,
  //   10,
  //   'https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/image-018f80af-65bb-48fd-ba2f-43051785c660',
  // );

  // router.push(`/recommendation/${recommendationId}`);
  // console.log("recommendation_id = ", recommendationId);
  // const Recommendation = await getRecommendationRecordById(recommendationId);
  // console.log("recommendation for image = ", Recommendation);


  const textSearchResult = await handleTextSearch (
    '我想要找一件黑色牛仔長褲，可以用來搭配我的白色 T-shirt',
    'gpt-4o-mini',
    'female',
  )
  // console.log("text search result = ", textSearchResult);


  const imgSearchResult = await handleImageSearch (
    'female',
    'gpt-4o-mini',
    'https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/image-018f80af-65bb-48fd-ba2f-43051785c660',
  )
  // console.log("Image search result = ", JSON.stringify(imgSearchResult, null, 2));

  return (
    <div style={{ padding: "20px" }}>
      <h1>Playground</h1>

      {/* Image Search Results */}
      <h2>Image Search Results</h2>
      {imgSearchResult && imgSearchResult.series && imgSearchResult.series.length > 0 ? (
        imgSearchResult.series.map((series, seriesIndex) => (
          <div key={`img-series-${seriesIndex}`} style={{ marginBottom: "40px" }}>
            <h3>Series {seriesIndex + 1}</h3>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {series.items.map((item, itemIndex) => (
                <div
                  key={`img-item-${itemIndex}`}
                  style={{
                    margin: "10px",
                    textAlign: "center",
                    border: "1px solid #ddd",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title || `Item ${itemIndex + 1}`}
                      width={200}
                      height={300}
                      style={{ borderRadius: "8px" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "200px",
                        height: "300px",
                        backgroundColor: "#ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "8px",
                      }}
                    >
                      <p>No Image Available</p>
                    </div>
                  )}
                  <p>{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No image search results found.</p>
      )}

      {/* Text Search Results */}
      <h2>Text Search Results</h2>
      {textSearchResult && textSearchResult.series && textSearchResult.series.length > 0 ? (
        textSearchResult.series.map((series, seriesIndex) => (
          <div key={`text-series-${seriesIndex}`} style={{ marginBottom: "40px" }}>
            <h3>Series {seriesIndex + 1}</h3>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {series.items.map((item, itemIndex) => (
                <div
                  key={`text-item-${itemIndex}`}
                  style={{
                    margin: "10px",
                    textAlign: "center",
                    border: "1px solid #ddd",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title || `Item ${itemIndex + 1}`}
                      width={200}
                      height={300}
                      style={{ borderRadius: "8px" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "200px",
                        height: "300px",
                        backgroundColor: "#ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "8px",
                      }}
                    >
                      <p>No Image Available</p>
                    </div>
                  )}
                  <p>{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No text search results found.</p>
      )}
    </div>
  );
}

