const express = require("express");
const { getProvincesStats, getProvinceStatsById, getProvinceStatsByName, getKabsStats, getSchools, getTeams } = require("./scraper");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.set("json spaces", 2);
app.use(cors({
    origin: "*"
}));

app.get("/", (_, res) => res.send("Hello world"));

// Provinsi
app.get("/provinces", async (req, res) => {
    const identifier = req.query.identifier;
    if (!identifier) return res.json(await getProvincesStats());
    else {
        const pid = await getProvinceStatsById(identifier);
        if (pid && pid.result) return res.json(pid);
        const pname = await getProvinceStatsByName(identifier);
        if (pname && pname.result) return res.json(pname);
        else return res.json({});
    }
});

// Kabupaten
app.get("/daftar-kabupaten", async (req, res) => {
    if (!req.query.provinceId) return res.status(400).json({
        error: "Missing provinceId"
    });
    return res.json(await getKabsStats(req.query.provinceId));
});

// Sekolah
app.get("/daftar-sekolah", async(req, res) => {
    const provinceId = req.query.provinceId;
    if (!provinceId) return res.status(400).json({
        error: "Missing provinceId"
    });
    const kabId = req.query.kabId;
    if (!kabId) return res.status(400).json({
        error: "Missing kabId"
    });
    return res.json(await getSchools(provinceId, kabId));
});

app.get("/daftar-tim", async(req, res) => {
    const provinceId = req.query.provinceId;
    if (!provinceId) return res.status(400).json({
        error: "Missing provinceId"
    });
    const kabId = req.query.kabId;
    if (!kabId) return res.status(400).json({
        error: "Missing kabId"
    });
    const schoolId = req.query.schoolId;
    if (!schoolId) return res.status(400).json({
        error: "Missing schoolId"
    });
    const schoolType = req.query.schoolTypeId;
    if (!schoolType) return res.status(400).json({
        error: "Missing schoolTypeId"
    });
    return res.json(await getTeams(provinceId, kabId, schoolId, schoolType));
});

const listener = app.listen(PORT, () => {
    console.log(`Listening to ${listener.address().port}`);
});