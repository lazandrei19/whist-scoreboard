import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import PlayerName from "./components/PlayerName";

const App: React.FC = () => {
  const [players, setPlayers] = useState<string[]>([]);
  const [rounds, setRounds] = useState<number[]>([]);

  useEffect(() => {
    let _rounds: number[] = [];
    for (let i = 0; i < players.length; i++) _rounds.push(1);
    _rounds = [..._rounds, 2, 3, 4, 5, 6, 7];
    for (let i = 0; i < players.length; i++) _rounds.push(8);
    _rounds = [..._rounds, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < players.length; i++) _rounds.push(1);
    setRounds(_rounds);
  }, [players]);

  const addPlayer = () => {
    setPlayers((players) => [...players, `Player #${players.length + 1}`]);
  };

  const onDelete = useCallback(
    (name: string) => {
      setPlayers((players) =>
        players.filter((playerName) => playerName !== name)
      );
    },
    [setPlayers]
  );

  const changePlayerName = (oldName: string, newName: string): boolean => {
    const namesSet = new Set(players);
    namesSet.delete(oldName);
    if (namesSet.has(newName)) return false;
    setPlayers((players) =>
      players.map((name) => (name === oldName ? newName : name))
    );
    return true;
  };

  return (
    <table>
      <tr>
        <th
          style={{
            width: "2%",
          }}
        />
        {players.map((name) => (
          <PlayerName
            initialName={name}
            key={name}
            onDelete={() => onDelete(name)}
            onChange={(newName) => changePlayerName(name, newName)}
            width={players.length === 8 ? 98 / 8 : 90 / players.length}
          />
        ))}
        {players.length < 8 && (
          <th
            id="add"
            onClick={addPlayer}
            style={{
              width: "8%",
            }}
          >
            Add player
          </th>
        )}
      </tr>
      {rounds.map((num, index) => (
        <tr key={index}>
          <td>{num.toString()}</td>
          {players.map((name) => (
            <>
              <td>0</td>
              <td>0</td>
              <td>0</td>
            </>
          ))}
          {players.length < 8 && <td />}
        </tr>
      ))}
    </table>
  );
};

export default App;
