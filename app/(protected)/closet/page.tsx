import { getFavoriteByUserId } from "@/actions/favorite";
import UnderConstruction from "@/components/under-construction";
import { createClient } from "@/utils/supabase/server";

const ClosetPage = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  console.log(user)
  if (!user) return <></>;
  const favorites = await getFavoriteByUserId(user?.id);
  console.log(favorites);


  return <UnderConstruction />;
}

export default ClosetPage;