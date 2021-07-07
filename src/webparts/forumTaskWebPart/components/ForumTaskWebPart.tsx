import * as React from 'react';
import styles from './ForumTaskWebPart.module.scss';
import { IForumTaskWebPartProps } from './IForumTaskWebPartProps';
import { IForumTaskWebPartStates } from './IForumTaskWebPartStates';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPService } from '../../../Services/SPService';
import { sp } from '@pnp/sp/presets/all';
import { IQuestion } from '../../../Models/IQuestion';
import { IComment } from '../../../Models/IComment';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { QuestionPage } from './QuestionPage';
import { QuestionForm } from './QuestionForm/QuestionForm';
import { DefaultButton, Stack } from 'office-ui-fabric-react';
import QuestionContainerFunctional from './QuestionContainerFunctional';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SpContext } from './SpContext';

export default class ForumTaskWebPart extends React.Component<
  IForumTaskWebPartProps,
  IForumTaskWebPartStates,
  {}
> {
  private spOps: SPService;

  constructor(props: IForumTaskWebPartProps) {
    super(props);
    this.spOps = new SPService();
    this.state = {
      questions: [],
      allComments: [],
      filter: 1,
    };
    sp.setup(this.props.context);
    this.getAllQuestions = this.getAllQuestions.bind(this);
    this.getOpenQuestions = this.getOpenQuestions.bind(this);
    this.getAnsweredQuestions = this.getAnsweredQuestions.bind(this);
  }

  getAllQuestions() {
    this.spOps.getQuestions(this.props.context).then((response) => {
      this.setState({ questions: response, filter: 1 });
    });
  }

  getOpenQuestions() {
    this.spOps.getQuestions(this.props.context).then((response) => {
      var _questions: IQuestion[] = [];

      for (var question of response) {
        if (!question.Answered) {
          _questions.push(question);
        }
      }

      this.setState({ questions: _questions, filter: 2 });
    });
  }

  getAnsweredQuestions() {
    this.spOps.getQuestions(this.props.context).then((response) => {
      var _questions: IQuestion[] = [];

      for (var question of response) {
        if (question.Answered) {
          _questions.push(question);
        }
      }

      this.setState({ questions: _questions, filter: 3 });
    });
  }

  async componentDidMount() {
    this.getAllQuestions();
  }

  public render(): React.ReactElement<IForumTaskWebPartProps> {
    return (
      <div>
        <div>
          <SpContext.Provider value={this.props.context}>
            <Router>
              <Switch>
                <Route path='/question/:id' component={QuestionPage}></Route>

                <Route path='/'>
                  <QuestionForm
                    buttonTitle='Ask a question'
                    context={this.props.context}
                  />
                  <br />
                  <br />
                  <Stack horizontal className={styles.Card}>
                    <DefaultButton
                      text='All Questions'
                      className={
                        this.state.filter == 1
                          ? styles.filterSelectedButton
                          : styles.filterButton
                      }
                      onClick={this.getAllQuestions}
                    />
                    <DefaultButton
                      text='Open'
                      className={
                        this.state.filter == 2
                          ? styles.filterSelectedButton
                          : styles.filterButton
                      }
                      onClick={this.getOpenQuestions}
                    />
                    <DefaultButton
                      text='Answered'
                      className={
                        this.state.filter == 3
                          ? styles.filterSelectedButton
                          : styles.filterButton
                      }
                      onClick={this.getAnsweredQuestions}
                    />
                  </Stack>

                  {this.state.questions.map((question) => {
                    return <QuestionContainerFunctional question={question} />;
                  })}
                </Route>
              </Switch>
            </Router>
          </SpContext.Provider>
        </div>
      </div>
    );
  }
}
