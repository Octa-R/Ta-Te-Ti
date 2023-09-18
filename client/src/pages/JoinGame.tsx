import { useNavigate } from "react-router-dom";
import { Button, Stack, TextInput } from "@mantine/core"
import { useSetRecoilState } from "recoil";
import { currentPlayerData } from "../atoms";
import { useState } from "react";
import { useGameEndpoint } from "../hooks/useGameEndpoint";

export function JoinGame() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("")
  const [playerName, setPlayerName] = useState("anon")
  const setCurrentPlayerData = useSetRecoilState(currentPlayerData)
  const { isLoading, fetchData } = useGameEndpoint();

  const handleClick = () => {
    fetchData({ playerName, action: 'join', roomId, })
      .then((json) => {
        setCurrentPlayerData({
          name: json.name,
          mark: json.mark,
          isHost: json.isHost,
          playerId: json.playerId,
          roomId: json.roomId,
        });
        navigate('/game');
      })
      .catch(() => {
        console.error("err")
      });
  };
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
        w={{ base: 250, sm: 250, md: 350, lg: 400 }}
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
        w={{ base: 250, sm: 250, md: 350, lg: 400 }}
        onChange={(event) => {
          setRoomId(event.currentTarget.value)
        }} />
      {isLoading ?
        <Button loading onClick={handleClick}
          size='xl'
          variant="filled"
          w={{ base: 250, sm: 250, md: 350, lg: 400 }}
          mt={40}
        >
          Unirse a partida
        </Button> : <Button onClick={handleClick}
          size='xl'
          variant="filled"
          w={{ base: 250, sm: 250, md: 350, lg: 400 }}
          mt={40}
        >
          Unirse a partida
        </Button>}

    </Stack>
  )
}