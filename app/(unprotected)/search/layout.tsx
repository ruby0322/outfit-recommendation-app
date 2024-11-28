'use server'

import React, { Suspense } from "react";

const SearchLayout = async ({ children }: { children: React.ReactNode }) => {
  return <Suspense>
    { children }
  </Suspense>;
}

export default SearchLayout;