import { getFavoriteByUserId } from "@/actions/favorite";
import ItemList from "@/components/item/item-list";
import ItemListSkeleton from "@/components/item/item-list-skeleton";
import UnderConstruction from "@/components/under-construction";
import { createClient } from "@/utils/supabase/server";

const ClosetPage = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  console.log(user)
  if (!user) return <></>;
  const favorites = await getFavoriteByUserId(user?.id);
  console.log(favorites);

  return <>{!favorites ? (
    <ItemListSkeleton index={0} />
  ) : (
    <ItemList
      title='我的最愛'
      description={'你收藏的服飾都會被收納在這裡'}
      series={favorites}
      id={""}
      index={0}
      expandOnMount={true}
      expandable={false}
    />
  )}</>;
  return <UnderConstruction />;
}

export default ClosetPage;