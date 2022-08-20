import { BaseRequestData, BaseResponseData } from './common';

export interface GetDevicesRequest extends BaseRequestData {
  cmd: 'GET_DEVICES';
  sid: string;
  data: Record<string, never>;
}

export type GetDevicesResponse = BaseResponseData<{
  devices: {
    /**
     * AirConditioner ID
     */
    id: number;

    /**
     * @example null
     */
    providerName?: any;

    /**
     * example 'A/C'
     */
    deviceTypeName: string;

    /**
     * @example 'מיני מרכזי'
     */
    manufactor: string;

    /**
     * @example null
     */
    photoId?: any;

    /**
     * @example 15
     */
    permissions: number;

    /**
     * @example false
     */
    isGroupMember: boolean;

    /**
     * @example null
     */
    mode?: any;

    /**
     * @example 1
     */
    deviceTypeId: number;

    /**
     * @example 'מזגן'
     */
    name: string;

    /**
     * @example 1
     */
    status: number;

    /**
     * @example 1
     */
    providerid: number;

    /**
     * @example null
     */
    latitude?: any;

    /**
     * @example null
     */
    longitude?: any;

    /**
     * @example null
     */
    location?: any;
    sn: string;
    mac: string;
    model: string;

    /**
     * @example null
     */
    hwVersion?: any;

    /**
     * @example '611V4-C01'
     */
    fmVersion: string;
    userId: number;
    manufactorId: number;
    iconId: string;
    hasImage: boolean;
    deviceToken: string;
    mqttId: string;
    enableEvents: boolean;
    isActivated: boolean;
    logLevel?: any;
    lastIntervalActivity?: any;
    PowerOnID?: any;
    IsDebugMode: boolean;

    /**
     * @example '2022-04-20T10:22:40'
     */
    regdate: string;
  }[];
}>;
