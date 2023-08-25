import { useNavigate } from "react-router-dom";
import { Button, Stack, TextInput } from "@mantine/core"
import { useSetRecoilState } from "recoil";
import { currentPlayerData } from "../atoms";
import { useState } from "react";
import { PlayerData } from "../interfaces/player-data";

export function JoinGame() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("")
  const [playerName, setPlayerName] = useState("anon")
  const setCurrentPlayerData = useSetRecoilState(currentPlayerData)

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
      const json: PlayerData = await res.json()
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
        console.warn(e.message)
      })

  }
  return (
    <Stack className='h-full w-full bg-sky-700' spacing="xl" justify='center' align="center" p={16}>
      <TextInput
        labelProps={{ style: { color: '#FAFAFA' } }}
        required
        size="xl"
        placeholder="anon"
        variant="filled"
        withAsterisk={false}
        label={"Name"}
        value={playerName}
        w={{ base: 250, sm: 250, md: 300, lg: 400 }}
        onChange={(event) => {
          setPlayerName(event.currentTarget.value)
        }} />
      <TextInput
        labelProps={{ style: { color: '#FAFAFA' } }}
        required
        size="xl"
        placeholder="paste your room Id here"
        variant="filled"
        withAsterisk={false}
        label={"Room-id"}
        value={roomId}
        w={{ base: 250, sm: 250, md: 300, lg: 400 }}
        onChange={(event) => {
          setRoomId(event.currentTarget.value)
        }} />
      <Button onClick={handleClick}
        size='xl'
        variant="filled"
        w={{ base: 250, sm: 250, md: 300, lg: 400 }}
        mt={40}
      >
        Unirse a partida
      </Button>
    </Stack>
  )
}