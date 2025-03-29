import React from "react";

const Explication = ({ title, points }) => {
  return (
    <div className="collapse collapse-arrow bg-base-100 border border-primary my-2">
      <input type="radio" name="my-accordion-2" defaultChecked />
      <div className="collapse-title font-bold text-primary text-xl">{title}</div>
      <div className="collapse-content space-y-3 text-lg">
        {points.map((point, index) => (
          <p key={index} className=" ">
            <span className="mr-2 font-bold text-primary">⤷</span> {point}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Explication;
