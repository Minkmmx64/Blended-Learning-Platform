export class MenuCreateDTO {
  name: string;
  key: string;
  pid?: number;
}

export class MenuQueryDTO {
  name?: string;
  pid?: number;
}

export class MenuUpdateDTO {
  id: number;
  data: MenuCreateDTO;
}