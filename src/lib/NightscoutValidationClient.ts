import { NightscoutValidationEndpointResponse } from "./types";

type NightscoutValidationClientOptions = {
  endpointUrl: string;
};

export class NightscoutValidationClient {
  private endpointUrl: string;

  constructor(options: NightscoutValidationClientOptions) {
    this.endpointUrl = options.endpointUrl;
  }

  validateResponse(
    response: any
  ): response is NightscoutValidationEndpointResponse {
    // look into a validation library, maybe joi?
    // or just do some basic checking yourself.
    return true;
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
    const response = await fetch(this.endpointUrl, {
      method: "POST",
      body: requestBodyRaw,
      redirect: "follow",
      headers,
    });
    if (this.validateResponse(response)) {
      return response;
    }
    throw new Error("Validation endpoint returned invalid response");
  }
}
