export class OrderCreateDTO {
  shops: {
    id: number,
    prices: number,
    count: number
  }[]
  status: string;
  openid: string;
}