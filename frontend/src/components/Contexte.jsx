import React from "react";
import { Info } from "lucide-react";

const Contexte = ({ texte }) => {
  return (
    <div className="my-4 italic font-bold p-5 flex border border-primary rounded-3xl">
      <Info className="w-8 h-8 text-primary " />
      <p className="text-base ml-4">{texte}</p>
    </div>
  );
};

export default Contexte;
