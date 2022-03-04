import { SagaIterator } from "redux-saga";
import { ActionType } from "typesafe-actions";
import { call, takeLatest } from "redux-saga/effects";
import { getUserProfile, userProfileDeletionStart } from "../actions";
import { BackendClient } from "../../../api/backend";
import { handleGetUserProfile } from "./handleGetUserProfile";
import { deleteUserProfile } from "./orchestration";

export function* watchUserProfileSaga(
  client: ReturnType<typeof BackendClient>
): SagaIterator {
  yield takeLatest(
    getUserProfile.request,
    function* (action: ActionType<typeof getUserProfile.request>) {
      yield call(handleGetUserProfile, client.getProfile, action);
    }
  );

  yield takeLatest(userProfileDeletionStart, deleteUserProfile);
}
