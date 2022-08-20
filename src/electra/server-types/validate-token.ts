import { BaseRequestData, BaseResponseData, OsDetails } from './common';

export interface ValidateTokenRequest extends BaseRequestData {
  cmd: 'VALIDATE_TOKEN';
  sid: null;
  data: OsDetails & {
    imei: string;
    token: string;
  };
}

export type ValidateTokenResponse = BaseResponseData<{
  /**
   * This is the token
   */
  sid: string;
}>;
