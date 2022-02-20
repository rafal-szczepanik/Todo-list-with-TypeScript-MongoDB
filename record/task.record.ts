// import {createCustomError} from "../middleware/error-handler";
import {Task} from '../models/task';

export class TaskRecord {
    id?: string;
    name: string;
    completed: boolean

    constructor(obj: TaskRecord) {
        this.id = obj.id;
        this.name = obj.name;
        this.completed = obj.completed;
    }

    static async getAll(): Promise<TaskRecord[]> {
        const tasks = await Task.find() as TaskRecord[];
        return tasks.map(task => new TaskRecord(task));
    }

    static async getOne(id: string): Promise<TaskRecord> {
        const task = await Task.findOne({
            _id: id
        }) as TaskRecord
        return new TaskRecord(task);
    }

    async updateTask(task: TaskRecord): Promise<void> {
        await Task.findOneAndUpdate({
            _id: this.id,
        }, task as TaskRecord, {
            new: true,
            runValidators: true,
        });
    }

    async createTask(): Promise<string> {
        await Task.create({
            _id: this.id,
            name: this.name,
            completed: this.completed,
        });
        return this.id
    }

    async deleteTask(): Promise<void> {
        await Task.findOneAndDelete({
            _id: this.id
        });
    }
}
