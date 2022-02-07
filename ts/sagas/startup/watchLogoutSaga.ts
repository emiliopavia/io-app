import { readableReport } from "italia-ts-commons/lib/reporters";
import { call, put, takeEvery } from "typed-redux-saga/macro";
import { ActionType, getType } from "typesafe-actions";
import { BackendClient } from "../../api/backend";
import { startApplicationInitialization } from "../../store/actions/application";
import {
  logoutFailure,
  logoutRequest,
  logoutSuccess
} from "../../store/actions/authentication";
import { resetToAuthenticationRoute } from "../../store/actions/navigation";
import { ReduxSagaEffect, SagaCallReturnType } from "../../types/utils";
import { resetAssistanceData } from "../../utils/supportAssistance";

/**
 * Handles the logout flow
 */
// eslint-disable-next-line
export function* watchLogoutSaga(
  logout: ReturnType<typeof BackendClient>["logout"]
): Iterator<ReduxSagaEffect> {
  yield* takeEvery(
    getType(logoutRequest),
    function* (action: ActionType<typeof logoutRequest>) {
      // Issue a logout request to the backend, asking to delete the session
      // FIXME: if there's no connectivity to the backend, this request will
      //        block for a while.
      try {
        const response: SagaCallReturnType<typeof logout> = yield* call(
          logout,
          {}
        );
        if (response.isRight()) {
          if (response.value.status === 200) {
            yield* put(logoutSuccess(action.payload));
          } else {
            // We got a error, send a LOGOUT_FAILURE action so we can log it using Mixpanel
            const error = Error(
              response.value.status === 500 && response.value.value.title
                ? response.value.value.title
                : "Unknown error"
            );
            yield* put(logoutFailure({ error, options: action.payload }));
          }
        } else {
          const logoutError = {
            error: Error(readableReport(response.value)),
            options: action.payload
          };
          yield* put(logoutFailure(logoutError));
        }
      } catch (error) {
        const logoutError = {
          error,
          options: action.payload
        };
        yield* put(logoutFailure(logoutError));
      } finally {
        // clean up any assistance data
        resetAssistanceData();
        // If keepUserData is false, startApplicationInitialization is
        // dispatched within the componentDidMount of IngressScreen
        resetToAuthenticationRoute();
        yield* put(startApplicationInitialization());
      }
    }
  );
}
