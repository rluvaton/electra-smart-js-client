import axios, { AxiosInstance } from 'axios';
import { questionUntilValid, randomNumber, validateIsraelPhoneNumber } from '../general';
import {
  BaseRequestData,
  BaseResponseData,
  CheckOTPRequest,
  CheckOTPResponse,
  DiagL2,
  GetDevicesRequest,
  GetDevicesResponse,
  GetDeviceTelemetryRequest,
  GetDeviceTelemetryResponse,
  Hb,
  Oper,
  SendCommandRequest,
  SendCommandResponse,
  SendOTPRequest,
  SendOTPResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
} from './server-types';
import { SetOptional } from '../helper-types';
import * as readline from 'node:readline';

export class Client {
  private static api: AxiosInstance = axios.create({
    baseURL: 'https://app.ecpiot.co.il/mobile/mobilecommand',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Electra Client',
    },
  });

  private readonly imei: string;
  private readonly token: string;

  private sid: string;
  private sidCreationData: Date;

  constructor({ imei, token, sid }: { imei: string; token: string; sid?: string }) {
    if (sid) {
      this.sid = sid;
      this.sidCreationData = new Date();
    }

    this.imei = imei;
    this.token = token;
  }

  public getAuthData(): { imei: string; token: string } {
    return {
      imei: this.imei,
      token: this.token,
    };
  }

  private static async send<
    Request extends BaseRequestData = BaseRequestData,
    Response extends BaseResponseData<unknown> = BaseResponseData<unknown>,
  >(data: SetOptional<Request, Exclude<keyof BaseRequestData, 'cmd'>>): Promise<Response> {
    const body = {
      pvdid: 1,

      // I have no idea why
      id: randomNumber(1000, 1999),

      ...data,
    };

    const { data: response } = await this.api.post<Response>('/', body);

    if (response.status !== 0) {
      console.log('Request & Response', { request: body, response });

      throw new Error(`Invalid status code returned from API (${response.status})`);
    }

    if (response.data.res !== 0) {
      console.log('Request & Response', { request: body, response });

      throw new Error(`Invalid res returned from API (${response.data.res})`);
    }

    return response;
  }

  private static getOSDetails() {
    return {
      os: 'android',
      osver: 'M4B41Z',
    };
  }

  public static async auth(): Promise<Client> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    let imei: string;
    let token: string;
    let sid: string;

    try {
      const phoneNumber = await questionUntilValid({
        rl,
        question: 'What is your phone number?\n',
        validateAnswer: (phone) => {
          if (!validateIsraelPhoneNumber(phone)) {
            return `Invalid phone number (${phone})`;
          }
          return true;
        },
      });

      imei = await Client.sendOTPRequest(phoneNumber);

      const otpCode = await questionUntilValid({
        rl,
        question: 'What is the OTP code?\n',
        validateAnswer: (otp) => {
          if (!/^\d{4}$/.test(otp)) {
            return `OTP must be 4 digits (${otp})`;
          }
          return true;
        },
      });

      ({ imei, token, sid } = await Client.getOTPToken({ imei, phone: phoneNumber, otp: otpCode }));
    } finally {
      // Let the program exit when it finishes
      rl.close();
    }

    return new Client({
      imei,
      token,
      sid,
    });
  }

  /**
   * Send OTP request to get the OTP code, and then use the {@link Client#getOTPToken} method to get the imei and the token from it
   *
   * @return imei
   */
  public static async sendOTPRequest(phone: string): Promise<string> {
    if (!validateIsraelPhoneNumber(phone)) {
      throw new Error('Invalid phone number');
    }

    // Generate a random imei with a valid prefix (note: this might not be checked today, but just in case)
    const imei = `2b950000${randomNumber(10_000_000, 99_999_999)}`;

    await this.send<SendOTPRequest, SendOTPResponse>({
      cmd: 'SEND_OTP',
      data: {
        imei,
        phone,
        ...this.getOSDetails(),
      },
    });

    return imei;
  }

  /**
   * Send a request to get a token by providing the received otp code from {@link Client#sendOTPRequest}
   */
  public static async getOTPToken({
    imei,
    phone,
    otp,
  }: {
    imei: string;
    phone: string;
    otp: string;
  }): Promise<{ imei: string; token: string; sid: string }> {
    if (!validateIsraelPhoneNumber(phone)) {
      throw new Error('Invalid phone number');
    }

    const result = await this.send<CheckOTPRequest, CheckOTPResponse>({
      cmd: 'CHECK_OTP',
      data: {
        ...this.getOSDetails(),
        imei,
        phone,
        code: otp,
      },
    });

    return {
      imei,
      token: result.data.token,
      sid: result.data.sid,
    };
  }

  private async getSid(): Promise<ValidateTokenResponse['data']['sid']> {
    const result = await Client.send<ValidateTokenRequest, ValidateTokenResponse>({
      cmd: 'VALIDATE_TOKEN',
      data: {
        imei: this.imei,
        token: this.token,
        ...Client.getOSDetails(),
      },

      // This what we will get
      sid: null,
    });

    const sid = result?.data?.sid;

    if (!sid) {
      console.error('Something went wrong', result.data);
      throw new Error('Something went wrong getting the sid');
    }

    this.sid = sid;
    this.sidCreationData = new Date();

    return this.sid;
  }

  private async refreshSid(): Promise<string> {
    // TODO - need to add SID expiration logic
    if (this.sid) {
      return this.sid;
    }

    return await this.getSid();
  }

  async getDevices(): Promise<GetDevicesResponse['data']['devices']> {
    const result = await Client.send<GetDevicesRequest, GetDevicesResponse>({
      sid: await this.refreshSid(),
      cmd: 'GET_DEVICES',
      data: {},
    });

    return result.data.devices;
  }

  async getTelemetry(deviceId: number): Promise<{
    OPER: Oper;
    DIAG_L2: DiagL2;
    HB: Hb;
  }> {
    const result = await Client.send<GetDeviceTelemetryRequest, GetDeviceTelemetryResponse>({
      sid: await this.refreshSid(),
      cmd: 'GET_LAST_TELEMETRY',
      data: {
        id: deviceId,
        commandName: 'OPER,DIAG_L2,HB',
      },
    });

    return {
      OPER: JSON.parse(result.data.commandJson.OPER).OPER,
      DIAG_L2: JSON.parse(result.data.commandJson.DIAG_L2).DIAG_L2,
      HB: JSON.parse(result.data.commandJson.HB).HB,
    };
  }

  async getOperationalTelemetry(deviceId: number): Promise<Oper> {
    const result = await Client.send<GetDeviceTelemetryRequest, GetDeviceTelemetryResponse>({
      sid: await this.refreshSid(),
      cmd: 'GET_LAST_TELEMETRY',
      data: {
        id: deviceId,
        commandName: 'OPER',
      },
    });

    return JSON.parse(result.data.commandJson.OPER).OPER;
  }

  // Actions

  public async sendCommand(deviceId: number, overrideOperational: Partial<Oper>): Promise<SendCommandResponse> {
    // TODO - maybe send another request for telemetry to see if the request was successful?

    return await Client.send<SendCommandRequest, SendCommandResponse>({
      cmd: 'SEND_COMMAND',
      sid: await this.refreshSid(),
      data: {
        id: deviceId,
        commandJson: JSON.stringify({
          OPER: {
            // Must send all the data
            ...(await this.getOperationalTelemetry(deviceId)),
            ...overrideOperational,
          },
        }),
      },
    });
  }

  async setTemperature(deviceId: number, temp: number) {
    if (Number.isNaN(temp) || temp < 16 || temp > 30) {
      throw new Error('Temperature must be between 16 and 30');
    }

    await this.sendCommand(deviceId, {
      SPT: temp.toString(),
    });
  }

  async setMode(deviceId: number, mode: Oper['AC_MODE']) {
    await this.sendCommand(deviceId, {
      AC_MODE: mode,
    });
  }

  async setTimer(deviceId: number, timer: boolean) {
    await this.sendCommand(deviceId, {
      TIMER: timer ? 'ON' : 'OFF',
    });
  }

  async setShabbatMode(deviceId: number, shabbatMode: boolean) {
    await this.sendCommand(deviceId, {
      SHABAT: shabbatMode ? 'ON' : 'OFF',
    });
  }

  async setFanSpeed(deviceId: number, fanSpeed: Oper['FANSPD']) {
    await this.sendCommand(deviceId, {
      FANSPD: fanSpeed,
    });
  }

  async setIFeel(deviceId: number, ifeel: boolean) {
    await this.sendCommand(deviceId, {
      IFEEL: ifeel ? 'ON' : 'OFF',
    });
  }

  async setSleep(deviceId: number, sleep: boolean) {
    await this.sendCommand(deviceId, {
      SLEEP: sleep ? 'ON' : 'OFF',
    });
  }
}
