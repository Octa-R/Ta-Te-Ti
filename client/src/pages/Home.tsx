import { Button, Stack } from '@mantine/core';
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  return (
    <Stack className='h-full w-full bg-sky-700' spacing="xl" justify='center' align="center" p={16}>
      <Button
        size='xl'
        variant="filled"
        maw={400}
        miw={250}
        w={{ base: 200, sm: 200, lg: 600 }}
        onClick={() => {
          navigate("/create-game");
        }}
      >
        Crear nuevo juego
      </Button>
      <Button
        size='xl'
        maw={400}
        miw={250}
        variant="filled"
        w={{ base: 200, sm: 200, lg: 600 }}
        onClick={() => {
          navigate("/join-game");
        }}
      >
        Unirse a un juego
      </Button>
    </Stack >
  );
}
