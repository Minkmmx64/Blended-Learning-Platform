export class resourceCreateDTO{
  remark: string;
  name: string;
  src: string;
  cover: string;
  type: string;
  chapter_id: number;
}

export class resourceQueryDTO {

}

export class resourceUpdateDTO {
  id: number;
  data: resourceCreateDTO;
}
