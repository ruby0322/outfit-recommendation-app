"use server";

import{
    getItemById,
    getItemsByIds
} from "@/actions/item";

export default async function Playground() {
  const item_id = "1";
  const stringItems: string[] = ["1"];
//   try {
//       const itemById = await getItemsByIds(stringItems);
//       console.log("Find Item", itemById);
//   } catch (error) {
//       console.error("Error during backend function calls", error);
//   }
  return (
    <div>
      <h1>Playground</h1>
      <p>Check console for output</p>
    </div>
  );
}
