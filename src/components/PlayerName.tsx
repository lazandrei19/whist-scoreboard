import React, { useState } from "react";

interface OwnProps {
  initialName: string;
  onDelete: () => void;
  onChange: (newName: string) => boolean;
  onMove: (direction: "left" | "right") => void;
  width: number;
}

const PlayerName: React.FC<OwnProps> = ({
  initialName,
  onDelete,
  onChange,
  onMove,
  width,
}) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);

  const onClickDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) onDelete();
  };

  return (
    <th
      colSpan={3}
      style={{
        width: `${width}%`,
      }}
    >
      <div
        style={{
          width: "100%",
        }}
      >
        <span
          style={{
            marginRight: "25px",
            cursor: "pointer",
          }}
          onClick={() => {
            onMove("left");
          }}
        >
          &lt;
        </span>
        {editing ? (
          <input value={name} onChange={(ev) => setName(ev.target.value)} />
        ) : (
          <span className="playerName">{name}</span>
        )}
        <span
          style={{
            marginLeft: "25px",
            cursor: "pointer",
          }}
          onClick={() => {
            onMove("right");
          }}
        >
          &gt;
        </span>
      </div>
      <div className="controls">
        {editing ? (
          <>
            <span
              onClick={() => {
                if (onChange(name)) {
                  setEditing(false);
                }
              }}
            >
              save
            </span>
            <span
              onClick={() => {
                setEditing(false);
                setName(initialName);
              }}
            >
              cancel
            </span>
          </>
        ) : (
          <span onClick={() => setEditing(true)}>edit</span>
        )}
        <span onClick={onClickDelete}>delete</span>
      </div>
    </th>
  );
};

export default PlayerName;
