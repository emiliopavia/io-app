import { expectSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan/matchers";
import { getType } from "typesafe-actions";
import NavigationService from "../../../navigation/NavigationService";

import { saveNavigationStateSaga } from "../saveNavigationStateSaga";

import { setDeepLink } from "../../../store/actions/deepLink";

import ROUTES from "../../../navigation/routes";

jest.mock("react-native-share", () => ({
  open: jest.fn()
}));

describe("saveNavigationStateSaga", () => {
  it("should not set a deep link when not in main navigator", () =>
    expectSaga(saveNavigationStateSaga)
      .provide([
        [
          matchers.call(NavigationService.getCurrentRoute),
          {
            index: 0,
            routes: [{}]
          }
        ]
      ])
      .not.put.like({ action: { type: getType(setDeepLink) } })
      .run());
  it("should set a deep link when in main navigator", () => {
    const subRoute = {
      routeName: "Test",
      params: { myparam: true },
      key: "test"
    };
    return expectSaga(saveNavigationStateSaga)
      .provide([
        [
          matchers.call(NavigationService.getCurrentRoute),
          {
            index: 0,
            routes: [
              {
                routeName: ROUTES.MAIN,
                index: 0,
                routes: [subRoute]
              }
            ]
          }
        ]
      ])
      .put(setDeepLink(subRoute))
      .run();
  });
});
