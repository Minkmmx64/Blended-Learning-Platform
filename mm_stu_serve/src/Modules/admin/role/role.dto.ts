export class RoleQueryDTO {
  name?: string;
}

export class RoleCreateDTO {
  name: string;
  menus?: any;
  remark?: string;
}

export class RoleUpdateDTO {
  id: number;
  data: RoleCreateDTO;
}