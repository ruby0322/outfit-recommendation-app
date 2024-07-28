import { Recommendation } from "@/type";
import FeedbackCard from "./feedback-card";
import ItemList from "./item-list";

const EXAMPLE_RECOMMENDATIONS: Recommendation = {
  items: {
    韓系簡約: [
      {
        created_at: "",
        external_link: null,
        id: 0,
        image_url:
          "https://media.discordapp.net/attachments/893439505988743178/1267120091280179220/DALLE_2024-07-05_19.59.50_-_Create_a_high-quality_product_photo_of_a_lightweight_hoodie._The_hoodie_should_feature_a_simple_modern_design_made_from_high-quality_soft_and_ligh.webp?ex=66a7a10b&is=66a64f8b&hm=b55ba7f1463a7c675d35a587ee3ffd6f242e846e2f5c473e875ab8161bb3a305&=&format=webp&width=1124&height=1124",
        label_string: null,
        title: "超彈性牛仔褲",
        price: 399,
      },
      {
        created_at: "",
        external_link: null,
        id: 0,
        image_url:
          "https://media.discordapp.net/attachments/893439505988743178/1267120091930169354/DALLE_2024-07-05_19.59.13_-_Create_a_high-quality_product_photo_of_slim-fit_khaki_pants._The_pants_should_be_plain_featuring_a_simple_and_clean_design_made_from_high-quality_fa.webp?ex=66a7a10b&is=66a64f8b&hm=c377bd69de57c7f4d35040473fdd45e3538069777d517e0252dab4634a8b7c58&=&format=webp&width=1124&height=1124",
        label_string: null,
        title: "Heattech 保暖上衣",
        price: 399,
      },
      {
        created_at: "",
        external_link: null,
        id: 0,
        image_url:
          "https://media.discordapp.net/attachments/893439505988743178/1267120091280179220/DALLE_2024-07-05_19.59.50_-_Create_a_high-quality_product_photo_of_a_lightweight_hoodie._The_hoodie_should_feature_a_simple_modern_design_made_from_high-quality_soft_and_ligh.webp?ex=66a7a10b&is=66a64f8b&hm=b55ba7f1463a7c675d35a587ee3ffd6f242e846e2f5c473e875ab8161bb3a305&=&format=webp&width=1124&height=1124",
        label_string: null,
        title: "Airism 圓領T恤",
        price: 399,
      },
      {
        created_at: "",
        external_link: null,
        id: 0,
        image_url:
          "https://media.discordapp.net/attachments/893439505988743178/1267120091930169354/DALLE_2024-07-05_19.59.13_-_Create_a_high-quality_product_photo_of_slim-fit_khaki_pants._The_pants_should_be_plain_featuring_a_simple_and_clean_design_made_from_high-quality_fa.webp?ex=66a7a10b&is=66a64f8b&hm=c377bd69de57c7f4d35040473fdd45e3538069777d517e0252dab4634a8b7c58&=&format=webp&width=1124&height=1124",
        label_string: null,
        title: "Blocktech 防風外套",
        price: 399,
      },
      {
        created_at: "",
        external_link: null,
        id: 0,
        image_url:
          "https://media.discordapp.net/attachments/893439505988743178/1267120091280179220/DALLE_2024-07-05_19.59.50_-_Create_a_high-quality_product_photo_of_a_lightweight_hoodie._The_hoodie_should_feature_a_simple_modern_design_made_from_high-quality_soft_and_ligh.webp?ex=66a7a10b&is=66a64f8b&hm=b55ba7f1463a7c675d35a587ee3ffd6f242e846e2f5c473e875ab8161bb3a305&=&format=webp&width=1124&height=1124",
        label_string: null,
        title: "Supima 棉質毛衣",
        price: 399,
      },
    ],
    日系可愛: [
      {
        created_at: "",
        external_link: null,
        id: 0,
        image_url:
          "https://media.discordapp.net/attachments/893439505988743178/1267120092416577596/DALLE_2024-07-05_20.01.07_-_Create_a_high-quality_product_photo_of_relaxed_denim_jeans._The_jeans_should_feature_a_simple_modern_design_made_from_high-quality_soft_denim_fabri.webp?ex=66a7a10b&is=66a64f8b&hm=48c502f57580dc2f094aeb3145805b39f306f156c8daba6024170e651b414096&=&format=webp&width=1124&height=1124",
        label_string: null,
        title: "Dry-Ex 吸汗POLO衫",
        price: 399,
      },
      {
        created_at: "",
        external_link: null,
        id: 0,
        image_url:
          "https://media.discordapp.net/attachments/893439505988743178/1267120092907569243/DALLE_2024-07-05_20.01.36_-_Create_a_high-quality_product_photo_of_a_tailored_blazer._The_blazer_should_feature_a_simple_elegant_design_made_from_high-quality_fabric_with_a_tai.webp?ex=66a7a10c&is=66a64f8c&hm=289529967407501ef64a99de500c7ca8e843d5209bc0be3b89cb143a7db1630b&=&format=webp&width=1124&height=1124",
        label_string: null,
        title: "輕型羽絨外套",
        price: 399,
      },
      {
        created_at: "",
        external_link: null,
        id: 0,
        image_url:
          "https://media.discordapp.net/attachments/893439505988743178/1267120092416577596/DALLE_2024-07-05_20.01.07_-_Create_a_high-quality_product_photo_of_relaxed_denim_jeans._The_jeans_should_feature_a_simple_modern_design_made_from_high-quality_soft_denim_fabri.webp?ex=66a7a10b&is=66a64f8b&hm=48c502f57580dc2f094aeb3145805b39f306f156c8daba6024170e651b414096&=&format=webp&width=1124&height=1124",
        label_string: null,
        title: "亞麻混紡襯衫",
        price: 399,
      },
      {
        created_at: "",
        external_link: null,
        id: 0,
        image_url:
          "https://media.discordapp.net/attachments/893439505988743178/1267120092907569243/DALLE_2024-07-05_20.01.36_-_Create_a_high-quality_product_photo_of_a_tailored_blazer._The_blazer_should_feature_a_simple_elegant_design_made_from_high-quality_fabric_with_a_tai.webp?ex=66a7a10c&is=66a64f8c&hm=289529967407501ef64a99de500c7ca8e843d5209bc0be3b89cb143a7db1630b&=&format=webp&width=1124&height=1124",
        label_string: null,
        title: "EZY 九分褲",
        price: 399,
      },
      {
        created_at: "",
        external_link: null,
        id: 0,
        image_url:
          "https://media.discordapp.net/attachments/893439505988743178/1267120092416577596/DALLE_2024-07-05_20.01.07_-_Create_a_high-quality_product_photo_of_relaxed_denim_jeans._The_jeans_should_feature_a_simple_modern_design_made_from_high-quality_soft_denim_fabri.webp?ex=66a7a10b&is=66a64f8b&hm=48c502f57580dc2f094aeb3145805b39f306f156c8daba6024170e651b414096&=&format=webp&width=1124&height=1124",
        label_string: null,
        title: "無縫無鋼圈內衣",
        price: 399,
      },
    ],
  },
  params: {
    clothing_type: "top",
    created_at: new Date().toString(),
    height: 170,
    id: 0,
    style_preferences: "韓系,日系",
  },
  upload: {
    created_at: new Date().toString(),
    id: 0,
    image_url:
      "https://media.discordapp.net/attachments/893439505988743178/1267077952181506168/DALLE_2024-07-05_20.15.01_-_Create_a_high-quality_product_photo_of_a_casual_T-shirt._The_T-shirt_should_feature_a_simple_modern_design_made_from_high-quality_soft_fabric._Disp.webp?ex=66a779cc&is=66a6284c&hm=0a9c00dcfb8d12563edade2afb0e5950ffa7db6224db85bdbf78f7b1906d8a16&=&format=webp&width=1124&height=1124",
    label_string: "上衣,圓領,短袖",
    user_id: null,
  },
};

export default function Component() {
  return (
    <div className='w-full flex flex-col items-center justify-center gap-8 p-4'>
      <div className='flex flex-col gap-4 justify-center items-center'>
        {Object.keys(EXAMPLE_RECOMMENDATIONS.items).map(
          (recommendedStyle, index) => {
            return (
              <ItemList
                key={`recommended-style-${index}`}
                title={recommendedStyle}
                items={EXAMPLE_RECOMMENDATIONS.items[recommendedStyle]}
              />
            );
          }
        )}
        <FeedbackCard />
      </div>
    </div>
  );
}
