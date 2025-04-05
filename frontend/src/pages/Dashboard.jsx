import React from "react";
import Wrapper from "../components/Wrapper";
import Annalyse1 from "../components/Annalyse1";
import Annalyse2 from  "../components/Annalyse2";
import Annalyse3 from  "../components/Annalyse3";
import Annalyse4 from "../Annalyse4";

const Dashboard = () => {
  return (
    <Wrapper>
      <Annalyse1 />
      <Annalyse2 />
      <Annalyse3 />
      <Annalyse4 />
    </Wrapper>
  );
};

export default Dashboard;
