import * as React from 'react';
import { IQuestion } from '../../../Models/IQuestion';
import { IComment } from '../../../Models/IComment';
import styles from './ForumTaskWebPart.module.scss';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import {
  Stack,
  IStackStyles,
  IStackTokens,
  IStackItemStyles,
} from '@fluentui/react/lib/Stack';
import { Image, IImageProps, ImageFit } from '@fluentui/react/lib/Image';
import { SPService } from '../../../Services/SPService';

import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { divProperties } from 'office-ui-fabric-react';
import { sp } from '@pnp/sp/presets/all';
import { TeachingBubbleBase } from '@fluentui/react';
import CommentContainerFunctional from './CommentContainerFunctional';
import { SpContext } from './SpContext';
import { useContext } from 'react';

const tagStyles: IStackStyles = {
  root: {
    paddingLeft: 0,
  },
};
const itemAlignmentsStackTokens: IStackTokens = {
  childrenGap: 940,
  padding: 10,
};

const horizontalGapStackTokens: IStackTokens = {
  childrenGap: 10,
  padding: 10,
};

interface IQuestionPageProps {
  questionId: string;
}

interface IQuestionPageState {
  question: IQuestion;
  comments: IComment[];
  answer: IComment;
  author: string;
}

export class QuestionPage extends React.Component<
  IQuestionPageProps,
  IQuestionPageState,
  {}
> {
  private spOps: SPService = new SPService();

  async componentDidMount() {
    var _question = await this.spOps.getQuestion(
      this.props['match']['params']['id']
    );

    var att = await this.spOps.getAttachments(_question.ID);
    console.log(att);

    var _comments: IComment[] = [];

    for (var commentId of _question.CommentsId) {
      var comment = await this.spOps.getComment(Number(commentId));
      _comments.push(comment);
    }

    var response = await this.spOps.getUserNameSp(_question.AuthorId);

    this.setState({
      question: _question,
      comments: _comments,
      author: response['Title'],
    });

    this.getAnswers();
  }

  async submitComment() {
    const commentField = document.getElementById('commentField');
    var comment: IComment = {
      Body: commentField.innerHTML,
      AuthorId: await (await sp.web.currentUser()).Id,
      MarkedCorrect: false,
      QuestionId: this.state.question.ID,
    };

    var response = await this.spOps.addComment(comment);
    await this.spOps.addCommentToQuestion(
      this.state.question,
      response['data']['ID']
    );

    commentField.innerHTML = '';

    await this.getComments();
  }

  public async answerMarked() {
    var response = await this.spOps.setQuestionAnswered(this.state.question);
    var _question = await this.spOps.getQuestion(
      this.props['match']['params']['id']
    );

    this.setState({ question: _question });

    console.log(response);

    console.log(this.state.comments);
    await this.getComments();
    console.log(this.state.comments);

    this.getAnswers();
  }

  public async getComments() {
    var _comments: IComment[] = [];
    for (var commentId of this.state.question.CommentsId) {
      var comment = await this.spOps.getComment(Number(commentId));
      _comments.push(comment);
      console.log(comment);
    }

    this.setState({ comments: _comments });
  }
  public render() {
    return (
      <div>
        {this.state != null ? (
          <div>
            {(this.submitComment = this.submitComment.bind(this))}
            {(this.answerMarked = this.answerMarked.bind(this))}
            {(this.getComments = this.getComments.bind(this))}
            {(this.getImageUrl = this.getImageUrl.bind(this))}
            <div className={styles.Card}>
              <Stack horizontal tokens={itemAlignmentsStackTokens}>
                <Stack.Item align='center'>
                  <span className={styles.userProfileName}>
                    {this.state != null ? this.state.author : ''}
                  </span>
                </Stack.Item>
                {this.state.question.Answered ? (
                  <Stack.Item align='end' className={styles.Answered}>
                    <DefaultButton
                      text='Answered'
                      className={styles.Answered}
                    />
                  </Stack.Item>
                ) : null}
              </Stack>
              <div className={styles.questionPageTitle}>
                {this.state.question.Title}
              </div>
              <br />
              <br />
              <Image
                src={
                  this.state.question.QuestionImage != null
                    ? this.getImageUrl()
                    : ''
                }
                alt='Question Image'
              />
              <br />

              <div className={styles.questionPageBody}>
                {this.state.question.Body}
              </div>

              <br />
              <br />

              <div className={styles.inline}>
                Topics:
                <Stack
                  horizontal
                  disableShrink
                  styles={tagStyles}
                  tokens={horizontalGapStackTokens}
                >
                  {this.state.question.Topics.map((topic) => {
                    return (
                      <span className={styles.questionTags}>{topic.Label}</span>
                    );
                  })}
                </Stack>
              </div>
            </div>
            <br />
            <div>
              {this.state.answer != null ? (
                <CommentContainerFunctional
                  context={this.context}
                  comment={this.state.answer}
                  answerExists={true}
                />
              ) : (
                ''
              )}
            </div>
            <br />
            <h2>Write a comment</h2>
            <TextField
              id='commentField'
              placeholder='Write something, paste links, add images'
              multiline
              rows={6}
              resizable={false}
            />
            <br />
            <PrimaryButton text='Post' onClick={this.submitComment} />
            <br />
            <h2>{this.state.comments.length} Comments</h2>
            <div>
              {this.state.comments.map((comment) => {
                if (!comment.MarkedCorrect)
                  return (
                    <CommentContainerFunctional
                      context={this.context}
                      comment={comment}
                      answerExists={this.state.question.Answered}
                      answerMarked={this.answerMarked.bind(this)}
                    />
                  );
              })}
            </div>
          </div>
        ) : (
          ' '
        )}
      </div>
    );
  }

  getAnswers() {
    this.state.comments.map((comment) => {
      if (comment.MarkedCorrect) {
        this.setState({ answer: comment });
      }
    });
  }

  getImageUrl(): string {
    var imageJSON = JSON.parse(this.state.question.QuestionImage);

    return imageJSON['serverUrl'] + imageJSON['serverRelativeUrl'];
  }
}
