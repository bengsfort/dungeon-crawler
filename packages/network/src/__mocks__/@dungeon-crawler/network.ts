jest.mock("@dungeon-crawler/network", () => {
  let idCounter = 0;
  return {
    WsServer: jest.fn().mockImplementation(() => {
      return {
        id: ++idCounter,
      };
    }),
  };
});
