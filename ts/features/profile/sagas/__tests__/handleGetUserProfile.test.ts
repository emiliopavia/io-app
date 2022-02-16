import { expectSaga } from "redux-saga-test-plan";
import { left, right } from "fp-ts/lib/Either";
import { readableReport } from "italia-ts-commons/lib/reporters";
import { handleGetUserProfile } from "../handleGetUserProfile";
import mockedProfile from "../../../../__mocks__/initializedProfile";
import { getUserProfile } from "../../actions";
import { getGenericError, getNetworkError } from "../../../../utils/errors";

describe("handleGetUserProfile selector", () => {
  describe("given 200 response", () => {
    it("returns success with user profile", async () => {
      const request = jest.fn();
      request.mockImplementation(() =>
        right({ status: 200, value: mockedProfile })
      );

      await expectSaga(handleGetUserProfile, request, getUserProfile.request())
        .put(getUserProfile.success(mockedProfile))
        .run();
    });
  });

  describe("given 500 response", () => {
    it("returns failure with error", async () => {
      const request = jest.fn();
      request.mockImplementation(() => right({ status: 500 }));

      await expectSaga(handleGetUserProfile, request, getUserProfile.request())
        .put(
          getUserProfile.failure({
            ...getGenericError(new Error("response status 500"))
          })
        )
        .run();
    });
  });

  describe("given unexpected response", () => {
    it("returns failure with decoding error", async () => {
      const errors = [{ context: [], value: new Error("decoding error") }];
      const request = jest.fn();
      request.mockImplementation(() => left(errors));

      await expectSaga(handleGetUserProfile, request, getUserProfile.request())
        .put(
          getUserProfile.failure({
            ...getGenericError(new Error(readableReport(errors)))
          })
        )
        .run();
    });
  });

  describe("given an exception from the request", () => {
    it("returns failure with network error", async () => {
      const error = new Error("network error");

      const request = jest.fn();
      request.mockImplementation(() => {
        throw error;
      });

      await expectSaga(handleGetUserProfile, request, getUserProfile.request())
        .put(getUserProfile.failure(getNetworkError(error)))
        .run();
    });
  });
});
