import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { GameSocket } from './interfaces';
import {
  WsBadRequestException,
  WsUnknownException,
} from './exceptions/ws-exceptions';

@Catch(WsException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    Logger.log(
      'acordate de buscar formas de informar sobre los errores de validacion de input',
    );
    const socket = host.switchToWs().getClient<GameSocket>();

    if (exception instanceof BadRequestException) {
      const exceptionData = exception.getResponse();

      const wsException = new WsBadRequestException(
        exceptionData['message'] ?? 'Bad request',
      );

      socket.emit('exception', wsException.getError());
    }
    const wsException = new WsUnknownException(exception.message);
    socket.emit('exception', wsException.getError());
  }
}
