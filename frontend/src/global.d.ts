export {};

declare global {
  interface ImportMeta {
    env: {
      REACT_APP_BACKEND_BASEURL: string;
    };
  }
}
