import { DateTimeFieldFormatType } from '@pnp/sp/fields';
import { IComment } from './IComment';
import { ITopic } from './ITopic';

export interface IQuestion {
  ID?: number;
  Title: string;
  Body: string;
  QuestionImage?: string;
  Topics?: ITopic[];
  Answered?: boolean;
  CommentsId?: number[];
  AuthorId?: number;
  Created?: DateTimeFieldFormatType;
}
