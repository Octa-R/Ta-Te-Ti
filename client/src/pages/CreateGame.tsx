import { useNavigate } from "react-router-dom";
import { Button, Stack, TextInput } from '@mantine/core';
import { useSetRecoilState } from "recoil";
import { currentPlayerData, currentRoomIdState } from "../atoms";
import { useState } from "react";
import { SegmentedControl } from "@mantine/core";

export function CreateGame() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("anon")
  const [mark, setMark] = useState("X")
  const setCurrentPlayerData = useSetRecoilState(currentPlayerData)
  const setCurrentRoomId = useSetRecoilState(currentRoomIdState)
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
      console.log("json del post", json)
      setCurrentPlayerData(json)
      setCurrentRoomId(json.roomId)
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
    <Stack className='h-full w-full bg-sky-700' spacing="xl" justify='center' p={16}>
      <TextInput
        color="white"
        required
        size="xl"
        placeholder="anon"
        label="Name"
        variant="filled"
        withAsterisk={false}
        value={playerName}
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
        variant="filled" fullWidth
      >
        Crear partida
      </Button>
    </Stack>
  )
}