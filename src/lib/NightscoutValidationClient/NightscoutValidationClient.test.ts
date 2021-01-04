import { enableFetchMocks } from "jest-fetch-mock";
import { clone } from "ramda";
import { MOCK_NSV_RESPONSE_VALID } from "../__mocks__/gluco-check";
import { NightscoutValidationClient } from "./NightscoutValidationClient";

enableFetchMocks();

const MOCK_ENDPOINT_URL = "http://example.com";
const MOCK_NS_URL = "http://example.com/ns";
const MOCK_NS_TOKEN = "token123";

describe("NightscoutValidationClient", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("Fetches validation status from endpoint", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(MOCK_NSV_RESPONSE_VALID));

    const nsvClient = new NightscoutValidationClient({
      endpointUrl: MOCK_ENDPOINT_URL,
    });
    const response = await nsvClient.fetchValidationStatus(
      MOCK_NS_URL,
      MOCK_NS_TOKEN
    );

    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0]).toMatchSnapshot();
    expect(response).toMatchSnapshot();
  });

  it("Throws if fetch throws", async () => {
    expect.assertions(1);
    fetchMock.mockRejectOnce(new Error("The lesson is never try."));

    const nsvClient = new NightscoutValidationClient({
      endpointUrl: MOCK_ENDPOINT_URL,
    });

    try {
      await nsvClient.fetchValidationStatus(MOCK_NS_URL, MOCK_NS_TOKEN);
    } catch (e) {
      expect(e).toMatchInlineSnapshot(
        `[Error: Failed to fetch from nsv endpoint: Error: The lesson is never try.]`
      );
    }
  });

  it("Throws if response validation fails", async () => {
    expect.assertions(1);
    const invalidResponse = clone(MOCK_NSV_RESPONSE_VALID);
    invalidResponse.nightscout.glucoseUnit = "NOTAUNIT";
    fetchMock.mockResponseOnce(JSON.stringify(invalidResponse));

    const nsvClient = new NightscoutValidationClient({
      endpointUrl: MOCK_ENDPOINT_URL,
    });

    try {
      await nsvClient.fetchValidationStatus(MOCK_NS_URL, MOCK_NS_TOKEN);
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
        [Error: Invalid response from nsv endpoint: An instance of NightscoutValidationEndpointResponseDto has failed the validation:
         - property nightscout.glucoseUnit has failed the following constraints: isEnum 
        ]
      `);
    }
  });
});
