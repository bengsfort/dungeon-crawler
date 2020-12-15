export default class WebSocket {
  url: string;

  onopen = (): void => {};
  onclose = (): void => {};
  onmessage = (): void => {};
  onerror = (): void => {};

  send = jest.fn().mockImplementation((data: string) => {
    console.log("Mock send of JSON payload:", data);
  });

  constructor(address: string) {
    this.url = address;
  }
}
