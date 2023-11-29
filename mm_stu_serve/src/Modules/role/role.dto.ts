export class RoleQueryDTO {
    
}

export class RoleCreateDTO {
    name: string;
}

export class RoleUpdateDTO {
    id: number;
    data: RoleCreateDTO;
}