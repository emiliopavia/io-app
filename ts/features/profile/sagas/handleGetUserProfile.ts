import { ActionType } from "typesafe-actions";
import { call, put } from "redux-saga/effects";
import { readableReport } from "italia-ts-commons/lib/reporters";
import { BackendClient } from "../../../api/backend";
import { getUserProfile } from "../actions";
import { SagaCallReturnType } from "../../../types/utils";
import { getGenericError, getNetworkError } from "../../../utils/errors";

export function* handleGetUserProfile(
  getProfile: ReturnType<typeof BackendClient>["getProfile"],
  _: ActionType<typeof getUserProfile.request>
) {
  try {
    const response: SagaCallReturnType<typeof getProfile> = yield call(
      getProfile,
      {}
    );

    if (response.isRight()) {
      if (response.value.status === 200) {
        yield put(getUserProfile.success(response.value.value));
      } else {
        yield put(
          getUserProfile.failure({
            ...getGenericError(
              new Error(`response status ${response.value.status}`)
            )
          })
        );
      }
    } else {
      yield put(
        getUserProfile.failure({
          ...getGenericError(new Error(readableReport(response.value)))
        })
      );
    }
  } catch (e) {
    yield put(getUserProfile.failure(getNetworkError(e)));
  }
}
