import React from "react";
import classes from "./Order.css";

const Order = props => {
  let ingList = [];

  for (const key in props.ingredients) {
    ingList.push({
      name: key,
      amount: props.ingredients[key]
    });
  }

  const ingOutput = ingList.map(ing => {
    return (
      <span
        style={{
          textTransform: "capitalize",
          display: "inline-block",
          margin: "0 8px",
          border: "1px solid #ccc",
          padding: "5px"
        }}
        key={ing.name}
      >
        {ing.name} ({ing.amount})
      </span>
    );
  });

  return (
    <div className={classes.Order}>
      <p>Ingredients: {ingOutput}</p>
      <p>
        Price: <strong>USD {props.price.toFixed(2)}</strong>
      </p>
    </div>
  );
};

export default Order;
