export type TResponse<TData = unknown, TToken = unknown> = {
  status: number;
  message: string;
  data?: TData;
  tokens?: TToken;
};
