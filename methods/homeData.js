import { HomeData } from "../db/models/schema.js";
import imgurDelete from "../service/imgurDelete.js";
import imgurUpload from "../service/imgurUpload.js";


const homeDataPostDB = async (file, text,title) => {
    let currentData = await HomeData.findOne();

    if (currentData) {
        await imgurDelete(currentData.homeImage.deletehash)
        const image = await imgurUpload(file);

        currentData.homeImage = image;
        currentData.homeText = text;
        currentData.homeTitle= title;

        await currentData.save();
    } else {
        const image = await imgurUpload(file);
        const newHomeData = new HomeData({
            homeImage: image,
            homeText: text,
            homeTitle:title
        });

        await newHomeData.save();
        console.log('New home data created successfully.');
    }
}

const homeDataGetDB = async () => {
    try {
        const homeData = await HomeData.findOne();
        if (homeData) {
            return homeData;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching home data:', error);
        throw error;
    }
}

export { homeDataPostDB, homeDataGetDB }