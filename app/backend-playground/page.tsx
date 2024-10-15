"use server";

import prisma from "@/prisma/db";

export default async function Playground(){

  const testConnection = async () => {
    try {
      await prisma.$connect();
      console.log('connected!');
    } catch (e) {
      console.log(e);
    }
  }
  testConnection();

  return (
    <div>
      <h1>Playground2</h1>
      <p>Check console for output</p>
    </div>
  );
};

