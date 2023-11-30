const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const geomData = require("./data/geom.json");
const predJSON = require("./data/predictions.json");
const obsJSON = require("./data/test_set.json");
const { log } = require("console");

const PORT = 8000;
const predPath = path.join(__dirname, "data", "predictions.csv");
const testSetPath = path.join(__dirname, "data", "test_set.csv");
let predData
fs.readFile(predPath, "utf-8", (err, data) => {
    if (err) log(err)
    predData = data;
})
let testSetData
fs.readFile(testSetPath, "utf-8", (err, data) => {
    if (err) log(err)
    testSetData = data;
})
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

const geomIds = geomData.map(d => d.id)
let idsToSend = []

// app.post("/api/v1/geometry/", (req, res) => {
//     if (!req.body) res.status(400).end();
//     const body = req.body;
//     const bodyKeys = Object.keys(body);
//     if (bodyKeys.length !== 1 || bodyKeys[0] !== "id" || body.id.length === 0) res.status(400).end();
//     if (!body.id.every(id => geomIds.includes(id))) res.status(400).end();
//     idsToSend = body.id
//     res.status(200).json({ success: true }).end();
// })

app.get("/api/v1/geometry", (req, res) => {
    const data = idsToSend.map(id => geomData.find(d => d.id == id))
    res.status(200).json({ success: true, data }).end();
});

app.get("/api/v1/geometry/:id", (req, res) => {
    const data = geomData.find(d => d.id == req.params.id)
    res.status(200).json({ success: true, data }).end();
});

app.get("/data/predictions.csv", (req, res) => {
    res.status(200).send(predData).end();
})
app.get("/api/v1/prediction/:id", (req, res) => {
    const data = predJSON.find(d => d.id == req.params.id)
    res.status(200).json({ success: true, data }).end();
})
app.get("/data/test_set.csv", (req, res) => {
    res.status(200).send(testSetData).end();
})
app.get("/api/v1/observation/:id", (req, res) => {
    const data = obsJSON.find(d => d.id == req.params.id)
    res.status(200).json({ success: true, data }).end();
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
});