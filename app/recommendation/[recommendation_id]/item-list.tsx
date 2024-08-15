import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ItemTable } from "@/type";
import ItemCard from "./item-card";

const parseTags = (stylePreferencesString: string) => {
  return stylePreferencesString.split(",");
};

const ItemList = ({
  title,
  id,
  items,
  index,
}: {
  title: string;
  id: string;
  items: ItemTable[];
  index: number;
}) => {
  // console.log("title:", title);
  // console.log("items:", items);
  return (
    <div
      id={id}
      className={cn(
        "p-4 flex flex-col gap-6",
        index !== 0 && "border-t-[1px] border-gray-800/30"
      )}
    >
      {/* <h3 className='text-xl font-semibold text-muted-foreground'>{title}</h3> */}
      <div className='flex flex-wrap gap-2'>
        {parseTags(title).map((tag, index) => {
          return (
            <Badge
              className='bg-white'
              variant='outline'
              key={`style-preference-badge-${index}`}
            >
              {tag}
            </Badge>
          );
        })}
      </div>
      <div className='flex gap-4 flex-wrap items-center justify-center'>
        {items.map((item) => {
          return <ItemCard item={item} key={`item-card-${item.id}`} />;
        })}
      </div>
    </div>
  );
};

export default ItemList;
