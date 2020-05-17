import React, { useState, FormEvent, useContext } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid } from 'uuid';
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStore";

interface IProps {
  activity: IActivity | null | undefined;
}

const ActivityForm: React.FC<IProps> = ({ activity: initialFormState }) => {

  const activityStore = useContext(ActivityStore);
  const { createActivity, submitting, editActivity, cancelFormOpen } = activityStore;

  const initializeForm = () => {
    if (initialFormState) return initialFormState;
    return {
      id: "",
      title: "",
      category: "",
      description: "",
      date: "",
      city: "",
      venue: "",
    };
  };

  const [activity, setActivity] = useState<IActivity>(initializeForm);

  const handleInputchange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      const newActivity = { ...activity, id: uuid() };
      createActivity(newActivity);
    }
    else {
      editActivity(activity);
    }
  };

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input placeholder="Title" value={activity.title} name="title" onChange={handleInputchange} />
        <Form.TextArea
          rows={2}
          placeholder="Description"
          value={activity.description}
          name="description"
          onChange={handleInputchange}
        />
        <Form.Input
          placeholder="Category"
          value={activity.category}
          name="category"
          onChange={handleInputchange}
        />
        <Form.Input
          type="datetime-local"
          placeholder="Date"
          value={activity.date}
          name="date"
          onChange={handleInputchange}
        />
        <Form.Input placeholder="City" value={activity.city} name="city" onChange={handleInputchange} />
        <Form.Input placeholder="Venue" value={activity.venue} name="venue" onChange={handleInputchange} />
        <Button loading={submitting} floated="right" positive type="submit" content="Submit" />
        <Button onClick={cancelFormOpen} floated="right" type="button" content="Cancel" />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
