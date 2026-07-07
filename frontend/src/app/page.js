import React from "react";
import { getDemo } from "@/services/demoService";

const Home = async () => {
  const demoData = await getDemo();
  console.log(demoData);

  return <div>Dashboard :  {demoData.message}</div>;
};

export default Home;
