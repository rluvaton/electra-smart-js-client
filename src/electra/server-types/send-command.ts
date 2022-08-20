import { BaseRequestData, BaseResponseData } from './common';

export interface SendCommandRequest extends BaseRequestData {
  cmd: 'SEND_COMMAND';
  sid: string;
  data: {
    /**
     * Device ID
     */
    id: number;

    /**
     * JSON Stringify of what want to change
     *
     * @example '{"OPER":{"AC_MODE":"COOL","FANSPD":"LOW","SPT":18,"TIMER":"ON","SHABAT":"ON","IFEEL":"OFF","SLEEP":"OFF","CLEAR_FILT":"OFF","AC_STSRC":"WI-FI"}}'
     */
    commandJson: string;
  };
}

export type SendCommandResponse = BaseResponseData<Record<string, never>>;
