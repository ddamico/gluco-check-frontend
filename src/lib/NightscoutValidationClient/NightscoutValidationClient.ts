import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { NightscoutValidationClientOptions } from "./types";
import { NightscoutValidationEndpointResponseDto } from "./NightscoutValidationClientDto";
import { NightscoutValidationEndpointRequest } from "../types";

export const NSV_PATH = "/api/v1/validate-nightscout";

export class NightscoutValidationClient {
  private endpointUrl: string;

  constructor(options: NightscoutValidationClientOptions) {
    this.endpointUrl = options.endpointUrl;
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
      });
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
}
