export interface BaseRequestData {
  pvdid: 1;
  id: number;
  cmd: string;
}

export interface BaseResponseData<Data> {
  /**
   * This will equal the id in the request
   */
  id: number;

  /**
   * @example 1 or 0
   */
  status: number;

  desc: null;

  data: {
    res: number;
    res_desc: null;
  } & Data;
}

export type OnOrOff = 'ON' | 'OFF';

export interface OsDetails {
  /**
   * @example 'android'
   */
  os: string;

  /**
   * @example 'M4B41Z'
   */
  osver: string;
}
