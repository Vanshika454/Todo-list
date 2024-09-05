import React from "react";

function TodoItem(props) {
  const { name, id } = props;

  return (
    <div className="todo" key={id}>
      <div className="text">{name}</div>
    </div>
  );
}

export default TodoItem;
