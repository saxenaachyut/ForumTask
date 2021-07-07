import {
  Panel,
  PrimaryButton,
  TextField,
  Stack,
  DefaultButton,
  format,
} from 'office-ui-fabric-react';
import * as React from 'react';
import { useState } from 'react';
import {
  PeoplePicker,
  PrincipalType,
} from '@pnp/spfx-controls-react/lib/PeoplePicker';
import styles from '../../components/ForumTaskWebPart.module.scss';
import { IQuestion } from '../../../../Models/IQuestion';
import { WebPartContext } from '@microsoft/sp-webpart-base';

interface IQuestionFormProps {
  buttonTitle: string;
  context: WebPartContext;
}

export function QuestionForm(props: IQuestionFormProps) {
  let [isOpen, setIsOpen] = useState(false);
  let [form, setForm] = useState({ Title: '', Body: '' });
  return (
    <div>
      <PrimaryButton text={props.buttonTitle} onClick={() => setIsOpen(true)} />
      <Panel
        isOpen={isOpen}
        headerText='Ask a question'
        onDismiss={() => setIsOpen(false)}
      >
        <Stack tokens={{ childrenGap: 20 }}>
          <TextField
            label='Title'
            onChange={(e) =>
              setForm({ ...form, Title: (e.target as HTMLInputElement).value })
            }
          />
          <TextField multiline rows={6} label='Body' />
          <TextField label='Question Image' />
          <TextField label='Topics' />
          <PeoplePicker
            context={props.context}
            titleText='Author'
            personSelectionLimit={1}
            groupName={''}
            showtooltip={true}
            required={true}
            disabled={false}
            ensureUser={true}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
          />
          <TextField label='Attach Files' />

          <Stack horizontal horizontalAlign='end' tokens={{ childrenGap: 10 }}>
            <PrimaryButton text='Create' />
            <DefaultButton text='Cancel' onClick={() => setIsOpen(false)} />
          </Stack>
        </Stack>
      </Panel>
    </div>
  );
}
