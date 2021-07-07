import * as React from 'react';
import { useState, useEffect } from 'react';
import { IComment } from '../../../Models/IComment';
import styles from './ForumTaskWebPart.module.scss';

import {
  Stack,
  IStackStyles,
  IStackTokens,
  IStackItemStyles,
} from '@fluentui/react/lib/Stack';

import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { SPService } from '../../../Services/SPService';
import { WebPartContext } from '@microsoft/sp-webpart-base';

interface ICommentContainerProps {
  comment: IComment;
  answerExists: boolean;
  context: WebPartContext;
  answerMarked?: () => {};
}

const itemAlignmentsStackTokens: IStackTokens = {
  childrenGap: 920,
  padding: 10,
};

const CommentContainerFunctional = (props: ICommentContainerProps) => {
  let spOps = new SPService();
  const [markedCorrect, setMarkedCorrectState] = useState(
    props.comment.MarkedCorrect
  );
  const [author, setAuthor] = useState('');

  useEffect(() => {
    spOps
      .getUserNameSp(props.comment.AuthorId)
      .then((response) => setAuthor(response['Title']));
  }, []);

  useEffect(() => {
    if (markedCorrect && !props.comment.MarkedCorrect) {
      console.log('mark answer');
      var response = spOps.markCorrect(props.comment);

      console.log(response);
      props.answerMarked();
    }
  }, [markedCorrect]);

  return (
    <div>
      <div className={styles.Card}>
        <Stack horizontal tokens={itemAlignmentsStackTokens}>
          <Stack.Item align='center'>
            <span className={styles.userProfileName}>{author}</span>
          </Stack.Item>
          {markedCorrect ? (
            <Stack.Item align='end'>
              <DefaultButton
                text='Correct Answer'
                className={styles.Answered}
              />
            </Stack.Item>
          ) : !props.answerExists ? (
            <Stack.Item align='end'>
              <DefaultButton
                text='Mark Correct'
                onClick={() => {
                  setMarkedCorrectState(true);
                }}
              />
            </Stack.Item>
          ) : (
            ''
          )}
        </Stack>
        <p className={styles.questionDesc}>{props.comment.Body}</p>
      </div>
    </div>
  );
};

export default CommentContainerFunctional;
