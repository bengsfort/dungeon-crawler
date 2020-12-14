jest.mock("@dungeon-crawler/network", () => {
  return {
    WsServer: jest.fn().mockImplementation(() => {}),
  };
});
