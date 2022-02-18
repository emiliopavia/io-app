import * as pot from "italia-ts-commons/lib/pot";
import { getType } from "typesafe-actions";
import { fromNullable, none, Option } from "fp-ts/lib/Option";
import { createSelector } from "reselect";
import { InitializedProfile } from "../../../../definitions/backend/InitializedProfile";
import { Action } from "../../../store/actions/types";
import { getUserProfile } from "../actions";
import { getErrorFromNetworkError } from "../../../utils/errors";
import { GlobalState } from "../../../store/reducers/types";
import { EmailAddress } from "../../../../definitions/backend/EmailAddress";

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
