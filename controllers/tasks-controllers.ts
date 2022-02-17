import {TaskRecord} from '../record/task.record'
import {asyncWrapper} from '../middleware/async'
import {createCustomError} from "../middleware/error-handler"
import {Request, Response} from "express";

export const getAllTasks = asyncWrapper(async (req: Request, res: Response) => {

    const tasks = await TaskRecord.getAll();
    res
        .status(200)
        .json({tasks});
    // .json({status: "success", data: {tasks}, nbHits: tasks.length});

    //   .status(500)
    //   .json({msg: err});
});

export const getOneTask = asyncWrapper(async (req: Request, res: Response, next) => {
    const {id: taskId} = req.params;
    const task = await TaskRecord.getOne(taskId);
    console.log(task)
    if (!task) {
        // return next(createCustomError(`No task with id : ${taskId}`, 404));
        return res
            .status(404)
            .json({msg: `No task with id : ${taskId}`});
    }
    res
        .status(200)
        .json({task});
});

export const createTask = asyncWrapper(async (req: Request, res: Response) => {
    const newTask = new TaskRecord(req.body);
    await newTask.createTask();

    res
        .status(201)
        .json({newTask});
});

export const updateTask = asyncWrapper(async (req: Request, res: Response) => {
    const {id: taskId} = req.params;
    const task = await TaskRecord.getOne(taskId);
    await task.updateTask(req.body);
    const {name, completed}: Omit<TaskRecord, "id"> = req.body;
    if (!task) {
        return res
            .status(404)
            .json({msg: `No task with id : ${taskId}`});
    }
    res
        .status(200)
        .json({id: taskId, name, completed});
});

export const deleteTask = asyncWrapper(async (req: Request, res: Response) => {
    const {id: taskId} = req.params;
    const taskToDelete = await TaskRecord.getOne(taskId);
    await taskToDelete.deleteTask();
    if (!taskToDelete) {
        return res
            .status(404)
            .json({msg: `No task with id : ${taskId}`});
    }
    res
        .status(200)
        // .json({taskToDelete})
        // .end();
        .json({task: null, status: 'success'});
});
