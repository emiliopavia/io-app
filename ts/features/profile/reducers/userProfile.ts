import * as pot from "italia-ts-commons/lib/pot";
import { getType } from "typesafe-actions";
import { fromNullable, none, Option } from "fp-ts/lib/Option";
import { createSelector } from "reselect";
import { Pot } from "italia-ts-commons/lib/pot";
import { InitializedProfile } from "../../../../definitions/backend/InitializedProfile";
import { Action } from "../../../store/actions/types";
import { getUserProfile } from "../actions";
import { getErrorFromNetworkError } from "../../../utils/errors";
import { GlobalState } from "../../../store/reducers/types";
import { EmailAddress } from "../../../../definitions/backend/EmailAddress";
import { UserDataProcessingStatusEnum } from "../../../../definitions/backend/UserDataProcessingStatus";

export type UserProfileState = pot.Pot<InitializedProfile, Error>;

export const selectUserProfile = (state: GlobalState): UserProfileState =>
  state.userProfile;

export const selectUserEmail = createSelector(
  selectUserProfile,
  (userProfile: UserProfileState): EmailAddress | undefined =>
    pot.toOption(pot.map(userProfile, p => p.email) || pot.none).toUndefined()
);

export const selectUserFirstName = createSelector(
  selectUserProfile,
  (userProfile: UserProfileState): Option<string> =>
    pot.getOrElse(
      pot.map(userProfile, p => fromNullable(p.name)),
      none
    )
);

export const selectUserLastName = createSelector(
  selectUserProfile,
  (userProfile: UserProfileState): Option<string> =>
    pot.getOrElse(
      pot.map(userProfile, p => fromNullable(p.family_name)),
      none
    )
);

export const selectUserFullName = createSelector(
  [selectUserFirstName, selectUserLastName],
  (firstName, lastName): string | undefined =>
    firstName
      .chain(first => lastName.map(last => `${first} ${last}`))
      .toUndefined()
);

export const selectUserFiscalCode = createSelector(
  selectUserProfile,
  (userProfile: UserProfileState): string | undefined =>
    pot
      .toOption(pot.map(userProfile, p => p.fiscal_code) || pot.none)
      .toUndefined()
);

export const selectUserBirthdate = createSelector(
  selectUserProfile,
  (userProfile: UserProfileState): Date | undefined =>
    pot
      .toOption(pot.map(userProfile, p => p.date_of_birth) || pot.none)
      .toUndefined()
);

export const selectUserProfileDeletionStatus = (
  state: GlobalState
): Pot<boolean, Error> => {
  const toBoolean = (
    status: UserDataProcessingStatusEnum | undefined
  ): boolean => {
    switch (status) {
      case UserDataProcessingStatusEnum.PENDING:
        return true;
      case UserDataProcessingStatusEnum.WIP:
        return true;
      default:
        return false;
    }
  };

  return pot.fold(
    state.userDataProcessing.DELETE,
    () => pot.none as Pot<boolean, Error>,
    () => pot.noneLoading,
    v => pot.noneUpdating(toBoolean(v?.status)),
    e => pot.noneError(e),
    v => pot.some(toBoolean(v?.status)),
    v => pot.someLoading(toBoolean(v?.status)),
    (o, n) => pot.someUpdating(toBoolean(o?.status), toBoolean(n?.status)),
    (v, e) => pot.someError(toBoolean(v?.status), e)
  );
};

export const selectUserProfileDeletionRequest = createSelector(
  selectUserProfileDeletionStatus,
  (status: Pot<boolean, Error>): boolean => pot.isUpdating(status)
);

export const selectUserProfileDeletionError = createSelector(
  selectUserProfileDeletionStatus,
  (status: Pot<boolean, Error>): boolean => pot.isError(status)
);

export const selectUserProfileDeletionSuccess = createSelector(
  selectUserProfileDeletionStatus,
  (status: Pot<boolean, Error>): boolean =>
    !pot.isLoading(status) && pot.isSome(status) && status.value === true
);

const userProfileReducer = (
  state: UserProfileState = pot.none,
  action: Action
): UserProfileState => {
  switch (action.type) {
    case getType(getUserProfile.request):
      return pot.toLoading(state);
    case getType(getUserProfile.success):
      return pot.some(action.payload);
    case getType(getUserProfile.failure):
      return pot.toError(state, getErrorFromNetworkError(action.payload));
  }
  return state;
};

export default userProfileReducer;
