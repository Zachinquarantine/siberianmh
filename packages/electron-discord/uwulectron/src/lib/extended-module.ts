import axios, { AxiosInstance } from 'axios'
import { Module } from 'cookiecord'

export class ExtendedModule extends Module {
  protected api: AxiosInstance = this.createAxios()

  private createAxios() {
    return axios.create({
      withCredentials: true,
      baseURL: 'http://localhost:5000',
    })
  }
}
