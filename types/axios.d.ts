import axios from "axios";

declare module "axios" {
  export interface AxiosInstance {
    get<T = any, R = T, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>,
    ): Promise<R>;
    post<T = any, R = T, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<R>;
    put<T = any, R = T, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<R>;
    patch<T = any, R = T, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<R>;
    delete<T = any, R = T, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>,
    ): Promise<R>;
  }
}
