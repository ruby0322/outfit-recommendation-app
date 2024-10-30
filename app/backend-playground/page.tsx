"use server";

import { bruteForceAction } from "@/actions/utils/delete";

export default async function Playground2() {
  try {
      // const result = bruteForceAction(23);
      // console.log(result);

  } catch (error) {
      console.error("Error during backend function calls", error);
  }

  return (
    <div>
      <h1>Playground2</h1>
      <p>Check console for output</p>
    </div>
  );
}

