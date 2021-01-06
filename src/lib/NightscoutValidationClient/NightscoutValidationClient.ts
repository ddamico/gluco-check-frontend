import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { NightscoutValidationClientOptions } from "./types";
import { NightscoutValidationEndpointResponseDto } from "./NightscoutValidationClientDto";
import { NightscoutValidationEndpointRequest } from "../types";

export const NSV_PATH = "/api/v1/validate-nightscout";
export const STATUS_OK = 200;

export class NightscoutValidationClient {
  private endpointUrl: string;
  private controller: AbortController;
  private signal: AbortSignal;

  constructor(options: NightscoutValidationClientOptions) {
    this.endpointUrl = options.endpointUrl;
    this.controller = new AbortController();
    this.signal = this.controller.signal;
  }

  async fetchValidationStatus(
    nightscoutUrl: string,
    nightscoutToken: string
  ): Promise<NightscoutValidationEndpointResponseDto> {
    const requestBody: NightscoutValidationEndpointRequest = {
      url: nightscoutUrl,
      token: nightscoutToken,
    };
    const requestBodyRaw = JSON.stringify(requestBody);
    const headers = new Headers();
    headers.append("Content-Type", "application/json; charset=utf-8");

    let response;
    try {
      response = await fetch(`${this.endpointUrl}${NSV_PATH}`, {
        method: "POST",
        body: requestBodyRaw,
        redirect: "follow",
        headers,
        signal: this.signal,
      });
      if (response.status !== 200) {
        throw new Error("Received non-200 response status");
      }
    } catch (e) {
      throw new Error(`Failed to fetch from nsv endpoint: ${e}`);
    }

    const responseJson = await response?.json();
    try {
      const classifiedResponse = plainToClass(
        NightscoutValidationEndpointResponseDto,
        responseJson
      );

      const errors = await validate(classifiedResponse);
      if (errors.length) {
        throw errors;
      }

      return classifiedResponse;
    } catch (e) {
      throw new Error(`Invalid response from nsv endpoint: ${e}`);
    }
  }

  cancel() {
    this.controller.abort();
  }
}
