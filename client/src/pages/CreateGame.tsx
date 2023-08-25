import { useNavigate } from "react-router-dom";
import { Button, MediaQuery, Stack, TextInput } from '@mantine/core';
import { useSetRecoilState } from "recoil";
import { currentPlayerData } from "../atoms";
import { useState } from "react";
import { SegmentedControl } from "@mantine/core";

export function CreateGame() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("anon")
  const [mark, setMark] = useState("X")
  const setCurrentPlayerData = useSetRecoilState(currentPlayerData)
  const handleClick = () => {
    const fetchData = async () => {
      console.log({ mark: mark, name: playerName })
      const res = await fetch("http://localhost:3000/tateti/create", {
        method: "POST",
        body: JSON.stringify({ mark: mark, name: playerName }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error de servidor desconocido");
      }
      const json = await res.json()
      setCurrentPlayerData({
        name: json.name,
        mark: json.mark,
        isHost: json.isHost,
        playerId: json.playerId,
        roomId: json.roomId
      })
    }

    fetchData()
      .then(() => {
        navigate("/game");
      })
      .catch(e => {
        console.warn(e.message);
      });
  }

  return (
    <Stack className='h-full w-full bg-sky-700' spacing="xl" justify='center' align="center" p={16}>
      <TextInput
        labelProps={{ style: { color: '#FAFAFA' } }}
        required
        size="xl"
        placeholder="anon"
        label="Name"
        variant="filled"
        withAsterisk={false}
        value={playerName}
        w={{ base: 250, sm: 250, md: 300, lg: 400 }}

        onChange={(event) => {
          setPlayerName(event.currentTarget.value)
        }}
      />
      <SegmentedControl
        radius="xl"
        color={`${mark === "X" ? "blue" : "red"}`}
        size="xl"
        data={["X", "O"]}
        transitionDuration={100}
        onChange={(m) => {
          setMark(m)
        }} />
      <Button
        onClick={handleClick}
        size='xl'
        variant="filled"
        w={{ base: 250, sm: 250, md: 300, lg: 400 }}
      >
        Crear partida
      </Button>

    </Stack>
  )
}