import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { GameSocket } from '../interfaces';
import { WsBadRequestException, WsUnknownException } from './ws-exceptions';
import { ValidationError } from 'class-validator';

@Catch(WsException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    console.log('hola soy el catch');
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
    if (exception instanceof ValidationError) {
      Logger.log('error de val');
    }
    const wsException = new WsUnknownException(exception.message);
    socket.emit('exception', wsException.getError());
  }
}
