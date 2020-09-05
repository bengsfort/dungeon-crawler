export const handler = (port: number): (() => void) => (): void =>
  console.log(`Server up and running on port ${port}`);
