import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { ValidationError } from 'class-validator';
import { Server, Socket } from 'socket.io';

@Catch(WsException)
export class ValidationExceptionFilter extends BaseWsExceptionFilter<ValidationError> {
  catch(error: ValidationError, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();

    // const data = client.
    // const error = exception.getError();
    // const details = error instanceof Object ? { ...error } : { message: error };
    console.log('error de validacion');
    console.log({ error });
    // no funciona el envio de evento,

    client.send(
      JSON.stringify({
        event: 'validation-error',
        data: {
          id: (client as any).id,
          //   ...details,
        },
      }),
    );
  }
}
