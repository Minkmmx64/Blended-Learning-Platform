export class RoleQueryDTO {
    
}

export class RoleCreateDTO {
  name: string;
  menus?: any;
}

export class RoleUpdateDTO {
  id: number;
  data: RoleCreateDTO;
}