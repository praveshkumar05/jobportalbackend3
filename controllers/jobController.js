import mongoose from "mongoose";
import jobModel from "../models/jobModel.js";
import moment from 'moment'


export const createJobController = async (req, res, next) => {
    try {
        const { company, position } = req.body;
        if (!company || !position) {
            next("each field is required");
        }
        req.body.createdBy = req.user._id;
        const job = await jobModel.create(req.body);

        res.status(201).json({
            success: true,
            job
        })
    } catch (error) {
        console.log(error);
        next("there is error in creating job in catch block")
    }
}
export const getAllJobController = async (req, res, next) => {
    try {
        //const jobs = await jobModel.find();

        const { workType, status, search, sort } = req.query;

        const queryObject = {
            createdBy: req.user._id
        }
        if (status && status !== "All") {
            queryObject.status = status;
        }
        if (workType && workType !== 'All') {
            queryObject.workType = workType;
        }
        // if (search) {
        //     // queryObject.position = { $regex: search, $options: "i" };
        //     // queryObject.worklocation = { $regex: search, $options: "i" };
        //     queryObject.company = { $regex: search, $options: "i" };
        // }
        /// chat GPT
        if (search) {
            queryObject["$or"] = [
              { position: { $regex: search, $options: "i" } },
              { worklocation: { $regex: search, $options: "i" } },
              { company: { $regex: search, $options: "i" } }
            ];
          }
          
          var page=req.query.page||1;
          var limit=req.query.limit||10;
          var skip=(page-1)*limit;

        const jobs = await jobModel.find(queryObject).sort(sort === "latest" ? '-createdAt' : sort==='oldest'? "createdAt": sort==='a-z'?"company":"-company").skip(skip).limit(limit);
        const totalJobs=await jobModel.countDocuments(queryObject);
        const numOfPage= Math.ceil(totalJobs/limit); 
        res.status(200).send({
            success: true,
            totalJobs,
            numOfPage,
            jobs
        })
    }
    catch (error) {
        console.log(error);
        next(error, "there is some error in getting job controller in catch");
    }
}
export const updateJobController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { company, position, workType } = req.body;
        //validatioin
        if (!company || !position) {
            return next("Please Provide All Fields");
        }
        const job = await jobModel.findOne({ _id: id });
        if (!job) {
            return next("this job is not found");
        }
        // console.log(job.createdBy.toString());
        // console.log(req.user._id);
        // console.log(typeof(req.user._id));
        // console.log(typeof(job.createdBy));
        if ((req.user._id.valueOf() !== job.createdBy.valueOf())) {
            return next("You are not authorised for this job");
        }
        const updateJob = await jobModel.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(201).send({
            success: true,
            updateJob
        })
    } catch (error) {
        next(error, "some error occured during updation of project")

    }
}
export const deleteJobController = async (req, res, next) => {
    try {
        const { id } = req.params;

        const job = await jobModel.findOne({ _id: id });
        if (!job) {
            return next("Nope, there is no jobe like this")
        }
        if (req.user._id.valueOf() === job.createdBy.valueOf()) {
            const deleteJob = await jobModel.findByIdAndDelete(id);
            return res.status(201).send({
                success: true
            })
        }
        else {
            next("sorry you are not authorised to delete this job");
        }

    } catch (error) {
        // console.log(error);
        return next("there is some error during deletion of JOB")

    }
}

export const JobStatsController = async (req, res, next) => {
    try {

        const filteredJobs = await jobModel.aggregate([
            // Stage 1: Filter pizza order documents by pizza size
            {
                $match: { createdBy: new mongoose.Types.ObjectId(req.user._id) }
            },
            // Stage 2: Group remaining documents by pizza name and calculate total quantity
            {
                $group: { _id: "$status", count: { $sum: 1 } }
            }
        ])
        let defaultStats = {
            pending: filteredJobs.pending || 0,
            reject: filteredJobs.reject || 0,
            interview: filteredJobs.interview || 0
        }
        let monthlyApplication = await jobModel.aggregate([
            {
                $match: { createdBy: new mongoose.Types.ObjectId(req.user._id) }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 },

                }
            },
            {
                $sort: { '_id.year': -1, '_id.month': -1 }
            }
        ])
        monthlyApplication = monthlyApplication.map((item) => {

            const { _id: { year, month }, count } = item;

            const date = moment()
                .month(month - 1)
                .year(year)
                .format("MMM Y");
            return { date, count };
        })
        return res.status(201).send({
            success: true,
            filteredJobs,
            monthlyApplication
        })
    } catch (error) {
        console.log(error);
        next("error in getting filtered JOb", error);
    }
}

// search job pagination job

