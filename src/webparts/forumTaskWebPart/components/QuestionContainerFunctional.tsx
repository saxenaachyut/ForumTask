import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { IQuestion } from '../../../Models/IQuestion';
import styles from './ForumTaskWebPart.module.scss';
import {
  Stack,
  IStackStyles,
  IStackTokens,
  IStackItemStyles,
} from '@fluentui/react/lib/Stack';

import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { SPService } from '../../../Services/SPService';
import { SpContext } from './SpContext';

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

const QuestionContainerFunctional = ({ question }) => {
  let spOps = new SPService();
  let [author, setAuthor] = useState('');
  const context = useContext(SpContext);

  useEffect(() => {
    spOps.getUserName(context, question.AuthorId).then((response) => {
      setAuthor(response['Title']);
    });
  }, []);

  return (
    <div>
      <div className={styles.Card}>
        <Stack horizontal tokens={itemAlignmentsStackTokens}>
          <Stack.Item align='center'>
            <span className={styles.userProfileName}>
              {author != '' ? author : ''}
            </span>
            <br />
            <span>Asked on {question.Created}</span>
          </Stack.Item>
          {question.Answered ? (
            <Stack.Item align='end' className={styles.Answered}>
              <DefaultButton text='Answered' className={styles.Answered} />
            </Stack.Item>
          ) : null}
        </Stack>
        <Link to={`/question/${question.ID}`}>
          <div className={styles.questionTitle}>{question.Title}</div>
        </Link>

        <p className={styles.questionDesc}>
          {question.Body.length <= 30
            ? question.Body
            : question.Body.substring(0, 30) + '...'}
        </p>
        <div>
          <Stack
            horizontal
            disableShrink
            styles={tagStyles}
            tokens={horizontalGapStackTokens}
          >
            {question.Topics.map((topic) => {
              return <span className={styles.questionTags}>{topic.Label}</span>;
            })}
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default QuestionContainerFunctional;
