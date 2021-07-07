import { DateTimeFieldFormatType } from '@pnp/sp/fields';

export interface IComment {
  ID?: number;
  Title?: string;
  Body: string;
  AuthorId: number;
  MarkedCorrect: boolean;
  Created?: DateTimeFieldFormatType;
  QuestionId: number;
}
