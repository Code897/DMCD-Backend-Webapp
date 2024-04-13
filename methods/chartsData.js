import { User } from "../db/models/schema.js"

const getReligionChartData = async () => {
    try {
        const religionData = await User.aggregate([
            {
                $group: {
                    _id: "$religion",
                    count: { $sum: 1 }
                }
            }
        ]);

        const counts = {};
        religionData.forEach(data => {
            counts[data._id] = data.count;
        });
        return counts;
    } catch (error) {
        console.error('Error getting religion data:', error);
        throw new Error('Internal server error');
    }
}

const getCityCountData = async () => {
    try {
        const cityData = await User.aggregate([
            {
                $group: {
                    _id: "$city",
                    count: { $sum: 1 }
                }
            }
        ]);

        const counts = {};
        cityData.forEach(data => {
            counts[data._id] = data.count;
        });
        return counts;
    } catch (error) {
        console.error('Error getting city data:', error);
        throw new Error('Internal server error');
    }
}

const getAgeGenderCountData = async () => {
    try {
        const ageGenderData = await User.aggregate([
            { 
                $addFields: { 
                    age: { 
                        $subtract: [
                            { $year: new Date() },
                            { $year: { $toDate: "$dateOfBirth" } }
                        ]
                    }
                } 
            },
            { 
                $addFields: { 
                    ageGroup: { 
                        $switch: { 
                            branches: [ 
                                { case: { $lt: ["$age", 18] }, then: "below 18" }, 
                                { case: { $and: [{ $gte: ["$age", 18] }, { $lt: ["$age", 25] }] }, then: "18-24" }, 
                                { case: { $and: [{ $gte: ["$age", 25] }, { $lt: ["$age", 31] }] }, then: "25-30" }, 
                                { case: { $and: [{ $gte: ["$age", 31] }, { $lt: ["$age", 41] }] }, then: "31-40" }, 
                                { case: { $and: [{ $gte: ["$age", 41] }, { $lt: ["$age", 51] }] }, then: "41-50" }, 
                                { case: { $and: [{ $gte: ["$age", 51] }, { $lt: ["$age", 61] }] }, then: "51-60" }, 
                                { case: { $gte: ["$age", 61] }, then: "60+" }
                            ], 
                            default: "unknown" 
                        } 
                    } 
                } 
            }, 
            { 
                $group: { 
                    _id: { 
                        ageGroup: "$ageGroup", 
                        gender: "$gender"
                    }, 
                    count: { $sum: 1 } 
                } 
            },
            {
                $project: {
                    _id: 0,
                    ageGroup: "$_id.ageGroup",
                    gender: "$_id.gender",
                    count: 1
                }
            }
        ]);

        const data = {};

        ageGenderData.forEach(entry => {
            const { ageGroup, gender } = entry;
            if (!data[ageGroup]) {
                data[ageGroup] = {};
            }
            data[ageGroup][gender] = entry.count;
        });

        return data;
    } catch (error) {
        console.error('Error getting age-gender data:', error);
        throw new Error('Internal server error');
    }
}


export {getReligionChartData,getCityCountData,getAgeGenderCountData};