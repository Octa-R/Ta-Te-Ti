import { useNavigate } from "react-router-dom";
import { Button, Stack, TextInput } from "@mantine/core"
import { useSetRecoilState } from "recoil";
import { currentPlayerData, currentRoomIdState } from "../atoms";
import { useState } from "react";

export function JoinGame() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("")
  const [playerName, setPlayerName] = useState("anon")
  const setCurrentPlayerData = useSetRecoilState(currentPlayerData)
  const setCurrentRoomId = useSetRecoilState(currentRoomIdState)

  const handleClick = () => {
    const fetchData = async () => {
      const data = { name: playerName, roomId }
      console.log("se va a acer fetch a /tateti/join con esta data:", data)
      const res = await fetch("http://localhost:3000/tateti/join", {
        method: "POST",
        body: JSON.stringify(data),
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
        console.warn(e.message)
      })

  }
  return (
    <Stack className='h-full w-full bg-sky-700' spacing="xl" justify='center' p={16}>
      <TextInput
        color="white"
        required
        size="xl"
        placeholder="anon"
        variant="filled"
        withAsterisk={false}
        label={"Name"}
        value={playerName}
        onChange={(event) => {
          setPlayerName(event.currentTarget.value)
        }} />
      <TextInput
        color="white"
        required
        size="xl"
        placeholder="paste your room Id here"
        variant="filled"
        withAsterisk={false}
        label={"Room-id"}
        value={roomId}
        onChange={(event) => {
          setRoomId(event.currentTarget.value)
        }} />
      <Button onClick={handleClick}
        size='xl'
        variant="filled"
        fullWidth>
        Unirse a partida
      </Button>
    </Stack>
  )
}