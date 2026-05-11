import Service from "../models/File.js";


export const fileUpload = async (req, res) =>{
    const file = req.body;
    const result = await Service.insertOne(file);
    res.send(result);
}

