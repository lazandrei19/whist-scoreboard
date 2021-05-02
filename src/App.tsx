import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import NumericalInput from "./components/NumericalInput";
import PlayerName from "./components/PlayerName";

const App: React.FC = () => {
  const [players, setPlayers] = useState<string[]>(["Player #1"]);
  const [rounds, setRounds] = useState<number[]>([]);
  const [points, setPoints] = useState<
    Record<number, [number | undefined, number | undefined][]>
  >({});
  const [start8, setStart8] = useState(false);

  useEffect(() => {
    let _rounds: number[] = [];
    if (start8) {
      for (let i = 0; i < players.length; i++) _rounds.push(8);
      _rounds = [..._rounds, 7, 6, 5, 4, 3, 2];
      for (let i = 0; i < players.length; i++) _rounds.push(1);
      _rounds = [..._rounds, 2, 3, 4, 5, 6, 7];
      for (let i = 0; i < players.length; i++) _rounds.push(8);
    } else {
      for (let i = 0; i < players.length; i++) _rounds.push(1);
      _rounds = [..._rounds, 2, 3, 4, 5, 6, 7];
      for (let i = 0; i < players.length; i++) _rounds.push(8);
      _rounds = [..._rounds, 7, 6, 5, 4, 3, 2];
      for (let i = 0; i < players.length; i++) _rounds.push(1);
    }
    setRounds(_rounds);
    if (players.length === Object.keys(points).length) return;

    let _points: typeof points = {};
    players.forEach((_, i) => {
      _points[i] = _rounds.map((_) => [undefined, undefined]);
    });
    setPoints(_points);
  }, [players, points, start8]);

  const lastPlayedRound = useMemo(() => {
    const lastPlayedRounds = Object.entries(points).map(([_, round]) =>
      round.findIndex(([a, b]) => a === undefined || b === undefined)
    );
    return Math.min(...lastPlayedRounds);
  }, [points]);

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

  const scoreTo = (index: number, roundNo: number): number | null => {
    if (roundNo === -1) return 0;
    const lastRoundScore = scoreTo(index, roundNo - 1);
    if (lastRoundScore === null) return null;
    const thisRound = points[index]?.[roundNo] ?? [undefined, undefined];
    if (thisRound[0] === undefined || thisRound[1] === undefined) return null;
    if (thisRound[0] === thisRound[1]) return lastRoundScore + 5 + thisRound[0];
    return lastRoundScore - Math.abs(thisRound[0] - thisRound[1]);
  };

  return (
    <>
      <label htmlFor="start8">
        <input
          type="checkbox"
          id="start8"
          onChange={(ev) => {
            setStart8(ev.target.checked);
          }}
        />
        Start 8
      </label>
      <table>
        <thead>
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
                onMove={(direction: "left" | "right") => {
                  const index = players.findIndex((p) => p === name);
                  const _players = players.filter((p) => p !== name);
                  if (direction === "right") {
                    _players.splice(index + 1, 0, name);
                  } else if (index > 0) {
                    _players.splice(index - 1, 0, name);
                  }
                  setPlayers(_players);
                }}
                width={players.length === 6 ? 98 / 6 : 90 / players.length}
              />
            ))}
            {players.length < 6 && (
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
        </thead>
        <tbody>
          {rounds.map((num, index) => (
            <tr key={`${num}$${index}`}>
              <td>{num.toString()}</td>
              {players.map((_, i) => (
                <>
                  <td>
                    {lastPlayedRound === index ||
                    lastPlayedRound - 1 === index ? (
                      <NumericalInput
                        value={points[i]?.[index]?.[0]}
                        onChange={(val) => {
                          setPoints((points) => ({
                            ...points,
                            [i]: points[i].map((_val, _index) =>
                              _index === index ? [val, _val[1]] : _val
                            ),
                          }));
                        }}
                        maxValue={num}
                      />
                    ) : (
                      points[i]?.[index]?.[0]
                    )}
                  </td>
                  <td>
                    {lastPlayedRound === index ||
                    lastPlayedRound - 1 === index ? (
                      <NumericalInput
                        value={points[i]?.[index]?.[1]}
                        onChange={(val) => {
                          setPoints((points) => ({
                            ...points,
                            [i]: points[i].map((_val, _index) =>
                              _index === index ? [_val[0], val] : _val
                            ),
                          }));
                        }}
                        maxValue={num}
                      />
                    ) : (
                      points[i]?.[index]?.[1]
                    )}
                  </td>
                  <td>
                    {lastPlayedRound === index
                      ? scoreTo(i, index - 1)
                      : scoreTo(i, index)}
                  </td>
                </>
              ))}
              {players.length < 6 && <td />}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default App;
