import { BaseRequestData, BaseResponseData, OnOrOff } from './common';
import { Stringify } from '../../helper-types';

export interface GetDeviceTelemetryRequest extends BaseRequestData {
  cmd: 'GET_LAST_TELEMETRY';
  sid: string;
  data: {
    /**
     * Device ID
     */
    id: number;

    /**
     * I think that each telemetry that wanted to be tracked on is separated by comma
     * @example 'OPER,DIAG_L2,HB'
     */
    commandName: string;
  };
}

export type GetDeviceTelemetryResponse = BaseResponseData<{
  timeDelta: number;

  /**
   *
   * Each key here will be the telemetry in the request commandName and the value is the json stringify of the telemetry
   * @example {
   *   OPER
   * }
   */
  commandJson: Record<string, string>;
}>;

export interface Oper {
  /**
   * The temperature in Celsius
   * @example '16'
   */
  SPT: Stringify<number>;

  /**
   * The last source of change I think
   */
  AC_STSRC: 'WI-FI' | 'IR' | string;

  /**
   * @example 'COOL'
   */
  AC_MODE: 'STBY' | 'COOL' | 'HEAT' | 'FAN' | 'DRY' | 'AUTO';

  /**
   * @example 'OFF'
   */
  TIMER: OnOrOff;

  /**
   * @example 'OFF'
   */
  SHABAT: OnOrOff;

  /**
   * @example 'OFF'
   */
  CLEAR_FILT: OnOrOff;

  /**
   * @example '3600'
   */
  DIAG_L2_PRD: Stringify<number>;

  /**
   * @example 'DRY' | 'MED' | 'HIGH' | 'AUTO'
   */
  FANSPD: 'LOW' | 'MED' | 'HIGH' | 'AUTO';

  /**
   * @example 'None'
   */
  FW_OTA: string;

  /**
   * @example 'OFF'
   */
  IFEEL: OnOrOff;

  /**
   * @example 'OFF'
   */
  SLEEP: OnOrOff;
}

export interface DiagL2 {
  /**
   * @example '43478'
   */
  IDU_RX_CNT: string;

  /**
   * @example '43478'
   */
  IDU_TX_CNT: string;

  /**
   * @example '24'
   */
  I_CALC_AT: string;

  /**
   * @example '23'
   */
  I_ICT: string;

  /**
   * @example '24'
   */
  I_RAT: string;

  /**
   * @example '0'
   */
  O_ACT_FREQ: string;

  /**
   * I think this is the number of good IR commands
   * @example '3'
   */
  GOOD_IR_CNT: string;

  /**
   * @example '17'
   */
  I_LOGIC_SPT: string;

  /**
   * @example 'ON'
   */
  I_ON_OFF_STAT: OnOrOff;

  /**
   * @example 'ON'
   */
  I_PUMP: OnOrOff;

  /**
   * @example '1188'
   */
  MAIN_PWR_STATUS: string;

  /**
   * @example 'COOL'
   */
  O_ODU_MODE: string;

  /**
   * @example '328'
   */
  SMPS_PWR_STATUS: string;

  /**
   * @example '0'
   */
  BAD_IR_CNT: string;

  /**
   * @example '192.168.1.x'
   */
  DISPLAY_IP: string;

  /**
   * @example '0'
   */
  IDU_CRC_ERR_RX_CNT: string;

  /**
   * @example 'CLOSE'
   */
  IP_HI_PRES: string;

  /**
   * @example 'CLOSE'
   */
  IP_LO_PRES: string;

  /**
   * @example 'NORM'
   */
  I_BAD_ICT: string;

  /**
   * @example 'NORM'
   */
  I_BAD_RAT: string;

  /**
   * @example 'OFF'
   */
  I_DEICER: string;

  /**
   * @example '0'
   */
  I_FAN_ACT: string;

  /**
   * @example 'NO LOCK'
   */
  I_LOCK: string;

  /**
   * @example '0'
   */
  I_NLOAD: string;

  /**
   * @example '22'
   */
  I_RCT: string;

  /**
   * @example 'OFF'
   */
  I_SELFTEST: string;

  /**
   * @example 'NO RQST'
   */
  I_STOP_COMP: string;

  /**
   * @example '0'
   */
  M2L_CRC_ERR_RX_CNT: string;

  /**
   * @example '0'
   */
  M2L_RX_CNT: string;

  /**
   * @example '0'
   */
  M2L_TX_CNT: string;

  /**
   * @example 'FANUP'
   */
  OFAN_TYPE: string;

  /**
   * @example '0'
   */
  O_AC_CURRENT: string;

  /**
   * @example 'NORM'
   */
  O_BAD_OMT: string;

  /**
   * @example '0'
   */
  O_CTT: string;

  /**
   * @exanple 'AC Current'
   */
  O_CUR_RWR_TYPE: string;

  /**
   * @example '0'
   */
  O_DC_CURRENT: string;
  O_EEV: string;
  O_EEV_DMSMP: string;

  /**
   * @example '0'
   */
  O_FANDOWN_SPD: string;

  /**
   * @example '0'
   */
  O_FANUP_SPD: string;

  /**
   * @example 'OFF'
   */
  O_FORCE_STDBY: string;
  O_GLT: string;
  O_HST: string;
  O_MODEL: string;
  O_OAT: string;
  O_OCT: string;
  O_OMT: string;

  /**
   * @example 'NORM'
   */
  O_PROT_RESON: string;

  /**
   * @example 'NORM'
   */
  O_PROT_STAT: string;

  /**
   * @example 'NORM'
   */
  O_RGT_BAD: string;

  /**
   * @example 'NORM'
   */
  O_RLT_BAD: string;

  /**
   * @example 'COOL'
   */
  O_RV: string;
  O_SYS_PWR: string;
  O_TRGT_FREQ: string;

  /**
   * @example '-44'
   */
  WI_FI_RSSI: string;
}

export interface Hb {
  /**
   * @example '2159'
   */
  HB_CNT: string;

  /**
   * @example 'HB'
   */
  MESSTYPE: string;
}
