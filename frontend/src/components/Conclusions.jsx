import React from 'react';

// Le composant prend une prop 'conclusions' qui peut être une seule conclusion ou une liste de conclusions.
const Conclusion = ({ conclusions }) => {
  // Si 'conclusions' est une seule chaîne, on la transforme en tableau pour uniformiser le rendu.
  const conclusionList = Array.isArray(conclusions) ? conclusions : [conclusions];

  return (
    <div className=' p-5 my-4 border border-primary rounded-3xl '>
      <h1 className="text-lg font-semibold mb-4">
        <div className="badge badge-primary">Conclusions</div>
      </h1>
      
      <ul className="steps steps-vertical ml-5 text-left">
        {conclusionList.map((conclusion, index) => (
          <li key={index} className={`step  step-primary `}>
            <span className='text-left my-1 italic'>{conclusion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Conclusion;
