'use server'

import React, { Suspense } from "react";

const UploadLayout = async ({ children }: { children: React.ReactNode }) => {
  return <Suspense>
    { children }
  </Suspense>;
}

export default UploadLayout;