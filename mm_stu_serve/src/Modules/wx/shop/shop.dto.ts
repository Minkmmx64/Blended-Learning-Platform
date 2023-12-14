
export class ShopCreateDTO{
  name: string;
  stock: number;
  avatar: string;
  prices: number;
  remark: string;
  classify_id: number;
}

export class ShopQueryDTO {
  name: string;
  classify_id: number;
}

export class ShopUpdateDTO {
  id: number;
  data: ShopCreateDTO;
}
