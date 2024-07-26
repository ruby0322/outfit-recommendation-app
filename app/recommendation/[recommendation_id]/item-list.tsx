import ItemCard from "./item-card";

const ItemList = ({ items }: { items: string[] }) => {
  return (
    <div className='flex flex-col gap-4 items-center justify-center'>
      {items.map((item, index) => (
        <ItemCard item={item}></ItemCard>
      ))}
    </div>
  );
};

export default ItemList;
