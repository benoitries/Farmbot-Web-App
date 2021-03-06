const mockStorj: Dictionary<boolean> = {};

jest.mock("../../../session", () => {
  return {
    Session: {
      getBool: (k: string) => {
        mockStorj[k] = !!mockStorj[k];
        return mockStorj[k];
      }
    }
  };
});

import { Dictionary } from "farmbot";
import { remove } from "../index";
import { fakeSequence } from "../../../__test_support__/fake_state/resources";
import { BooleanSetting } from "../../../session_keys";

describe("remove()", () => {
  beforeEach(function () {
    jest.clearAllMocks();
  });

  it("deletes step without confirmation", () => {
    const dispatch = jest.fn();
    mockStorj[BooleanSetting.confirmStepDeletion] = false;
    remove({ index: 0, dispatch, sequence: fakeSequence() });
    expect(dispatch).toHaveBeenCalled();
  });

  it("deletes step with confirmation", () => {
    const dispatch = jest.fn();
    mockStorj[BooleanSetting.confirmStepDeletion] = true;
    remove({ index: 0, dispatch, sequence: fakeSequence() });
    expect(dispatch).not.toHaveBeenCalled();
    // tslint:disable-next-line:no-any
    (global as any).confirm = () => true;
    remove({ index: 0, dispatch, sequence: fakeSequence() });
    expect(dispatch).toHaveBeenCalled();
  });
});
