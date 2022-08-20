import { BaseRequestData, BaseResponseData, OsDetails } from './common';

export interface CheckOTPRequest extends BaseRequestData {
  cmd: 'CHECK_OTP';
  data: OsDetails & {
    imei: string;
    phone: string;

    /**
     * The OTP code
     */
    code: string;
  };
}

export type CheckOTPResponse = BaseResponseData<{
  token: string;
  sid: string;
}>;
