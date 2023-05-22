import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../Models/activity";
import { useState, ChangeEvent } from "react";

interface Props {
  closeForm: () => void;
  activity?: Activity;
  createOrEdit: (activity: Activity) => void;
  submitting: boolean;
}

export default function ActivityForm({ closeForm, activity: selectedActivity, createOrEdit, submitting }: Props) {

  const initialState = selectedActivity ?? {
    id: "",
    title: "",
    date: "",
    description: "",
    category: "",
    city: "",
    venue: "",
  }

  const [activity, setActivity] = useState(initialState);

  function handleSubmit() {
    console.log(activity);
    createOrEdit(activity);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setActivity({ ...activity, [name]: value })

  }

  return (
    <Segment clearing>
      <Form>
        <Form.Input placeholder="title" value={activity.title} name="title" onChange={handleInputChange} />
        <Form.TextArea placeholder="Description" value={activity.description} name="description" onChange={handleInputChange} />
        <Form.Input placeholder="Category" value={activity.category} name="category" onChange={handleInputChange} />
        <Form.Input type="date" placeholder="Date" value={activity.date} name="date" onChange={handleInputChange} />
        <Form.Input placeholder="City" value={activity.city} name="city" onChange={handleInputChange} />
        <Form.Input placeholder="Venue" value={activity.venue} name="venue" onChange={handleInputChange} />
        <Button onClick={handleSubmit} floated="right" positive type="submit" content="Submit" loading={submitting} />
        <Button
          onClick={closeForm}
          floated="right"
          type="button"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
}
