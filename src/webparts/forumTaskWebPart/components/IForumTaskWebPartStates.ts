import { IComment } from '../../../Models/IComment';
import { IQuestion } from '../../../Models/IQuestion';
export interface IForumTaskWebPartStates {
  questions: IQuestion[];
  allComments: IComment[];
  filter: number;
}
