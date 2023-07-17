import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException, HttpException)
export class ValidationExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient() as WebSocket;
    const data = host.switchToWs().getData();
    // const error = exception.getError();
    // const details = error instanceof Object ? { ...error } : { message: error };
    console.log('error');
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
