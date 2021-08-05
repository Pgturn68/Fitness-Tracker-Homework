const express = require ("express")
const {Workout} = require ("../model")

const router = express.Router()

router.route("/api/workouts").get(async(req,res) => {
    await Workout.aggregate([
        {
            $addFields: {
                totalDuration: {
                    $sum: '$exercises.duration',
                },
            },
        },
        {
            $addFields: {
                totalDistance: {
                    $sum: '$exercises.distance',
                },
            },
        },
    ])
        .sort({ day: -1 })
        .limit(4)
        .then((result) => {
            console.log(result);
            res.json(result);
        })
        .catch((err) => {
            res.json(err);
        });
})
router.route("/api/workouts").post((req,res) => {
    console.log("body : ",req.body)
    if (req.body.type === 'resistance') { 
        Workout.create({
            day: Date.now(),
            exercises: [
                {
                    type: req.body.type,
                    name: req.body.name,
                    duration: req.body.duration,
                    weight: req.body.weight,
                    reps: req.body.reps,
                    sets: req.body.sets
                }
            ]
        }, (err, resp) => { 
            console.log("New docoument saved: ", resp);
            res.json({result: resp})
        })
        } else if (req.body.type === 'cardio') {
            Workout.create({
                day: Date.now(),
                exercises: [
                    {
                        type: req.body.type,
                        name: req.body.name,
                        duration: req.body.duration,
                        distance: req.body.distance
                    }
                ]
            }, (err, resp) => {
                console.log("New docoument saved: ", resp);
                res.json({ result: resp })

            })
        }   

})
router.route("/api/workouts/:id").put((req,res) => {
    console.log(`Workouts with PARAMS ID: ${req.params.id}`);

    if (req.body.type === 'resistance') {
        Workout.findByIdAndUpdate({ _id: req.params.id }, {
            $push: {
                exercises: {
                    type: req.body.type,
                    name: req.body.name,
                    duration: req.body.duration,
                    weight: req.body.weight,
                    reps: req.body.reps,
                    sets: req.body.sets
                }
            }
        }, (err, resp) => {
            console.log("Updated resp: ", resp);
            res.json({ results: resp })
        })
    } else if (req.body.type === 'cardio') {

        Workout.findByIdAndUpdate({ _id: req.params.id }, {
            $push: {
                exercises: {
                    type: req.body.type,
                    name: req.body.name,
                    duration: req.body.duration,
                    distance: req.body.distance,
                }
            }
        }, (err, resp) => {
            console.log("Updated resp: ", resp);
            res.json({ results: resp })
        })
    }
})

router.route("/api/workouts/range").get((req,res)=>{
    Workout.aggregate([
        {
            $addFields: {
                totalDuration: {
                    $sum: '$exercises.duration',
                },
            },
        },
    ])
        .sort({ day: -1 })
        .limit(7)
        .sort({ _id: 1 })
        .then((data) => {
            console.log(data);
            res.json(data);
        })
        .catch((err) => {
            res.json(err);
        }); 
})
module.exports = {router}