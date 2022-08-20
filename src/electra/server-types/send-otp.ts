import { BaseRequestData, BaseResponseData, OsDetails } from './common';

export interface SendOTPRequest extends BaseRequestData {
  cmd: 'SEND_OTP';
  data: OsDetails & {
    imei: string;
    phone: string;
  };
}

export type SendOTPResponse = BaseResponseData<Record<string, never>>;
