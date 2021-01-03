import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { NightscoutValidationClientOptions } from "./types";
import { NightscoutValidationEndpointResponse } from "./NightscoutValidationClientDto";

export class NightscoutValidationClient {
  private endpointUrl: string;

  constructor(options: NightscoutValidationClientOptions) {
    this.endpointUrl = options.endpointUrl;
  }

  async fetchValidationStatus(
    nightscoutUrl: string,
    nightscoutToken: string
  ): Promise<NightscoutValidationEndpointResponse> {
    const requestBodyRaw = JSON.stringify({
      url: nightscoutUrl,
      token: nightscoutToken,
    });
    const headers = new Headers();
    headers.append("Content-Type", "application/json; charset=utf-8");

    let response;
    try {
      response = await fetch(this.endpointUrl, {
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
        NightscoutValidationEndpointResponse,
        responseJson
      );
      await validate(classifiedResponse);
      return classifiedResponse;
    } catch (e) {
      throw new Error(`Invalid response from nsv endpoint: ${e}`);
    }
  }
}
