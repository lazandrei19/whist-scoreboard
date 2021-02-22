import React, { useState } from "react";

interface OwnProps {
  initialName: string;
  onDelete: () => void;
  onChange: (newName: string) => boolean;
  width: number;
}

const PlayerName: React.FC<OwnProps> = ({
  initialName,
  onDelete,
  onChange,
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
      {editing ? (
        <input value={name} onChange={(ev) => setName(ev.target.value)} />
      ) : (
        <span className="playerName">{name}</span>
      )}
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
