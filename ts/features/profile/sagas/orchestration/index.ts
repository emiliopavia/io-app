import { call } from "redux-saga/effects";
import { NavigationActions } from "react-navigation";
import {
  executeWorkUnit,
  withResetNavigationStack
} from "../../../../sagas/workUnit";
import PROFILE_DELETION_ROUTES from "../../navigation/routes";
import NavigationService from "../../../../navigation/NavigationService";
import {
  userProfileDeletionBack,
  userProfileDeletionCancel,
  userProfileDeletionCompleted,
  userProfileDeletionFailure
} from "../../actions";
import { SagaCallReturnType } from "../../../../types/utils";

function* profileDeletionWorkUnit() {
  return yield call(executeWorkUnit, {
    startScreenNavigation: () =>
      NavigationService.dispatchNavigationAction(
        NavigationActions.navigate({
          routeName: PROFILE_DELETION_ROUTES.START
        })
      ),
    startScreenName: PROFILE_DELETION_ROUTES.START,
    complete: userProfileDeletionCompleted,
    back: userProfileDeletionBack,
    cancel: userProfileDeletionCancel,
    failure: userProfileDeletionFailure
  });
}

export function* deleteUserProfile() {
  const result: SagaCallReturnType<typeof executeWorkUnit> = yield call(
    withResetNavigationStack,
    profileDeletionWorkUnit
  );
}
