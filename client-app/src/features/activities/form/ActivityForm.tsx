import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid } from 'uuid';
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStore";
import { RouteComponentProps } from "react-router-dom";

interface FormParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<FormParams>> = ({ match, history }) => {

  const activityStore = useContext(ActivityStore);
  const { createActivity,
    submitting,
    editActivity,
    loadActivity,
    activity: initialFormState,
    clearActivity } = activityStore;

  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",
  });

  useEffect(() => {
    if (match.params.id && activity.id.length === 0) {
      loadActivity(match.params.id)
        .then(() => initialFormState && setActivity(initialFormState));
    }
    return () => {
      clearActivity();
    }
  }, [loadActivity, clearActivity, initialFormState, match.params.id, activity.id.length]);

  const handleInputchange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      const newActivity = { ...activity, id: uuid() };
      createActivity(newActivity)
        .then(() => history.push(`/activities/${activity.id}`));
    }
    else {
      editActivity(activity)
        .then(() => history.push(`/activities/${activity.id}`));
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
        <Button onClick={() => {
          if (activity.id.length > 0)
            history.push(`/activities/${activity.id}`);
          else
            history.push("/activities");
        }}
          floated="right" type="button" content="Cancel" />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
