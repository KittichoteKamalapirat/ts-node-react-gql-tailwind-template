import getErrorMessage from "../getErrorMessage";

describe("getErrorMessage", () => {
  test("should return null with no error", () => {
    const message = getErrorMessage("test", undefined);
    expect(message).toBeNull();
  });

  test("should return message with error", () => {
    const message = getErrorMessage("name", {
      type: "error",
      message: "test message",
    });
    expect(message).toBe("name test message");
  });
});
