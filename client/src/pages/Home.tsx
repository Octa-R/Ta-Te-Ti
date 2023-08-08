import { Button, Stack } from '@mantine/core';
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  return (
    <Stack className='h-full w-full bg-sky-700' spacing="xl" justify='center' p={16}>
      <Button
        size='xl'
        variant="filled"
        fullWidth
        onClick={() => {
          navigate("/create-game");
        }}
      >
        Crear nuevo juego
      </Button>
      <Button
        size='xl'
        variant="filled"
        fullWidth
        onClick={() => {
          navigate("/join-game");
        }}
      >
        Unirse a un juego
      </Button>
    </Stack>
  );
}
