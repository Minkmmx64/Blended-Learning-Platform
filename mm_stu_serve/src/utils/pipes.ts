import { ArgumentMetadata, BadRequestException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { ObjectSchema } from "joi";
import { HttpResponse } from "src/response/response";
@Injectable()
export class ValidationPipe implements PipeTransform {

  constructor(private schema: ObjectSchema){}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if(error) {
      throw new BadRequestException(
                                    new HttpResponse<string>(HttpStatus.BAD_REQUEST, null, error.message).send()
      );
    }
    return value;
  }
  
}