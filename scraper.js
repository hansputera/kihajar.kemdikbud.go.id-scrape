const Request = require("./utils/Request");
const { getStatsTable, getStatsKabs, getTeams: GetTeams } = require("./utils/extract");
const { matchContent } = require("./utils/tizer");

async function getProvincesStats() {
    const { data } = await Request.get("/statistik");
    const result = getStatsTable(data);

    return result;
}

/**
 * 
 * @param {Number} province_id ID Provinsi
 */
async function getKabsStats(province_id) {
    const { data } = await Request.get(`/statistik/kabupaten?provinsi_id=${province_id}`);
    const result = getStatsTable(data);
    return result;
}

/**
 * 
 * @param {Number} province_id ID Provinsi
 * @param {Number} kab_id ID Kabupaten
 */
async function getSchools(province_id, kab_id) {
    const { data } = await Request.get(`/statistik/sekolah?provinsi_id=${province_id}&kabupaten_id=${kab_id}`);
    const result = getStatsKabs(data);
    return result;
}

/**
 * 
 * @param {Number} province_id ID Provinsi
 * @param {Number} kab_id ID Kabupaten
 * @param {String} school_id ID Unique Sekolah
 * @param {Number} school_type_id Type ID Sekolah
 */
async function getTeams(province_id, kab_id, school_id, school_type_id) {
    const { data } = await Request.get(`/statistik/tim?provinsi_id=${province_id}&kabupaten_id=${kab_id}&school_type_id=${school_type_id}&school_id=${school_id}`);
    const result = GetTeams(data);
    return result;
}

/**
 * 
 * @param {Number} provinceId Province ID
 * @param {Any} provinces Data provinsi
 */
async function getProvinceStatsById(provinceId, provinces) {
    if (!provinces) provinces = await getProvincesStats();
    return { result: provinces.rows.find(row => row.id == provinceId), last_change: provinces.last_change };
}

/**
 * 
 * @param {String} provinceName Nama provinsi yang ingin dicari
 */
async function getProvinceStatsByName(provinceName) {
    const provinces = await getProvincesStats();
    const identify = provinces.rows.filter(row => matchContent(row.name, provinceName));
    if (!identify.length) return undefined;
    let sd = { count: 0, teams: 0},
    smp = { count: 0, teams: 0},
    sma = { count: 0, teams: 0};

    identify.forEach(ident => {
        sd.count += ident.sd.count;
        sd.teams += ident.sd.teams;

        smp.count += ident.smp.count;
        smp.teams += ident.smp.teams;

        sma.count += ident.sma.count;
        sma.teams += ident.sma.teams;
    });
    return { sd, smp, sma, result: identify, last_change: provinces.last_change };
}

module.exports = { getProvincesStats, getProvinceStatsById, getProvinceStatsByName, getKabsStats, getSchools, getTeams };