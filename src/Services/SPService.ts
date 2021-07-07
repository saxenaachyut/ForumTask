import { IComment } from '../Models/IComment';
import { IQuestion } from '../Models/IQuestion';
import { sp } from '@pnp/sp/presets/all';
import { SPHttpClient } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
export class SPService {
  private questionsListName: string;
  private commentsListName: string;

  constructor() {
    this.questionsListName = 'Questions';
    this.commentsListName = 'Comments';
  }

  public getUserName(context: WebPartContext, id: number): Promise<any> {
    const url =
      `${context.pageContext.web.absoluteUrl}/_api/web/siteusers` +
      `/GetById(${id})`;
    return new Promise<any>((resolve, reject) => {
      context.spHttpClient
        .get(url, SPHttpClient.configurations.v1)
        .then((res: any) => {
          res.json().then((result: any) => {
            resolve(result);
          }),
            (error: any) => {
              reject(error);
            };
        });
    });
  }

  public getUserNameSp(id: number) {
    return sp.web.siteUsers.getById(id).get();
  }

  public getQuestions(context: WebPartContext): Promise<any> {
    return new Promise((resolve, reject) => {
      context.spHttpClient
        .get(
          `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Questions')/items`,
          SPHttpClient.configurations.v1
        )
        .then((res: any) => {
          res.json().then((result: any) => {
            resolve(result.value);
          }),
            (error: any) => {
              reject(error);
            };
        });
    });
  }

  public getComments(context: WebPartContext): Promise<any> {
    return new Promise((resolve, reject) => {
      context.spHttpClient
        .get(
          `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Comments')/items`,
          SPHttpClient.configurations.v1
        )
        .then((res: any) => {
          res.json().then((result: any) => {
            resolve(result.value);
          }),
            (error: any) => {
              reject(error);
            };
        });
    });
  }

  public getQuestion(id: number): Promise<any> {
    return sp.web.lists
      .getByTitle(this.questionsListName)
      .items.getById(id)
      .get();
  }

  public getComment(id: number): Promise<IComment> {
    return sp.web.lists
      .getByTitle(this.commentsListName)
      .items.getById(id)
      .get();
  }

  public addQuestion(question: IQuestion) {
    sp.web.lists.getByTitle(this.questionsListName).items.add(question);
  }

  public addComment(comment: IComment): Promise<any> {
    return sp.web.lists.getByTitle(this.commentsListName).items.add(comment);
  }

  public addCommentToQuestion(question: IQuestion, commentId: number) {
    var _tempCommentsId = question.CommentsId;
    _tempCommentsId.push(commentId);
    sp.web.lists
      .getByTitle(this.questionsListName)
      .items.getById(question.ID)
      .update({
        CommentsId: { results: _tempCommentsId },
      });
  }

  public setQuestionAnswered(question: IQuestion): Promise<any> {
    return sp.web.lists
      .getByTitle(this.questionsListName)
      .items.getById(question.ID)
      .update({
        Answered: true,
      });
  }

  public markCorrect(comment: IComment): Promise<any> {
    return sp.web.lists
      .getByTitle(this.commentsListName)
      .items.getById(comment.ID)
      .update({ MarkedCorrect: true });
  }

  public async getAttachments(id: number): Promise<any[]> {
    var item = sp.web.lists
      .getByTitle(this.questionsListName)
      .items.getById(id);

    return await item.attachmentFiles();
  }
}
