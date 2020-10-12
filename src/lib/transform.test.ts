import { userSettingsFormDataToUserSettingsDocument } from "./transform";
import { mockFormData } from "./__mocks__/settings";

describe("userSettingsFormDataToUserSettingsDocument", () => {
  it("returns a well formed document", () => {
    const resultDocument = userSettingsFormDataToUserSettingsDocument(
      mockFormData
    );
    expect(resultDocument).toMatchInlineSnapshot(`
      Object {
        "glucoseUnit": "mg/dl",
        "nightscout": Object {
          "token": "I am a token",
          "url": "https://example.com",
        },
      }
    `);
    expect(resultDocument.nightscout?.token).toEqual(
      mockFormData.nightscoutToken
    );
    expect(resultDocument.nightscout?.url).toEqual(mockFormData.nightscoutUrl);
    expect(resultDocument.glucoseUnit).toEqual(mockFormData.glucoseUnit);
  });
});
