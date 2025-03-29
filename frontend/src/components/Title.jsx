import React from 'react';

// Le composant prend deux props : 'text' pour le titre et 'number' pour le numéro à afficher.
const Title = ({ text, number }) => {
  return (
    <h1 className="text-3xl font-bold  my-8 underline">
     <span className=" text-blue-500 ">{number})</span>  {text} 
    </h1>
  );
};

export default Title;
