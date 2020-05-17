import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable loadingInitial = false;
    @observable selectedActivity: IActivity | undefined;
    @observable editMode = false;
    @observable submitting = false;
    @observable target = "";


    @computed get activitiesByDate() {
        return Array.from(this.activityRegistry.values())
            .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction("loading activities", () =>
                activities.forEach(activity => {
                    activity.date = activity.date.split(".")[0];
                    activities.push(activity);
                    this.activityRegistry.set(activity.id, activity);
                }));
        } catch (error) {
            console.log(error);
        }
        runInAction("loading activities initial", () => this.loadingInitial = false);
    }

    @action selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = false;
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction("create activity", () => {
                this.activityRegistry.set(activity.id, activity);
                this.selectActivity(activity.id);
                this.editMode = false;
            });
        } catch (error) {
            console.log(error);
        }
        runInAction("create activity submitting", () => this.submitting = false);
    }

    @action openCreateForm = () => {
        this.editMode = true;
        this.selectedActivity = undefined;
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction("edit activity", () => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
            });
        } catch (error) {
            console.log(error);
        }
        runInAction("edit activity submitting", () => this.submitting = false);
    }

    @action cancelFormOpen = () => {
        this.editMode = false;
    }

    @action openEditForm = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = true;
    }

    @action cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
        this.editMode = false;
    }

    @action deleteActivity = async (target: string, id: string) => {
        this.submitting = true;
        this.target = target;
        try {
            await agent.Activities.delete(id);
            runInAction("delete activity", () => {
                this.activityRegistry.delete(id);
                this.selectedActivity = undefined;
            });
        } catch (error) {
            console.log(error);
        }
        runInAction("delete activity cleanup", () => {
            this.target = "";
            this.submitting = false;
        });
    }
}

export default createContext(new ActivityStore())