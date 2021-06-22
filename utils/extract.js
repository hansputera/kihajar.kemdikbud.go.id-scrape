const cheerio = require("cheerio");
const Request = require("./Request");
const { cleanRow } = require("./tizer");

/**
 * 
 * @param {import("cheerio").Cheerio<import("cheerio").Element>} $jq 
 * @param {Number} child 
 */
function getRowByChild($jq, child) {
    return $jq.find(`td:nth-child(${child})`);
}

/**
 * 
 * @param {String} url URL Website
 * @param {String} paramKey Kunci
 */
function getParamValue(url, paramKey) {
    const u = new URL(url);
    return u.searchParams.get(paramKey);
}

/**
 * Fungsi mendapatkan semua data di dalam tabel
 * 
 * @param {String} data HTML
 */
function getStatsTable(data) {
    const $ = cheerio.load(data);
    const obj = {
        sd: {
            siswa: 0,
            teams: 0
        },
        smp: {
            siswa: 0,
            teams: 0
        },
        sma: {
            siswa: 0,
            teams: 0
        }
    };
    const rows = [];
    if ($("#table-statistics tbody tr").length == 1 && $("#table-statistics tbody tr .dataTables_empty").length) return { ...obj, rows };
    obj.last_change = $("h5.text-center").contents().last().text().trim().split("\n")[1].trim();
    $("#table-statistics tbody tr").each((index, element) => {
        const $row = $(element);
        const name = cleanRow(getRowByChild($row, 2).text());
        const id = parseInt(getParamValue(Request.defaults.baseURL + getRowByChild($row, 2).find("a").attr("href"), "provinsi_id"));
        const kabId = getParamValue(Request.defaults.baseURL + getRowByChild($row, 2).find("a").attr("href"), "kabupaten_id");

        // SD/MI
        const sd = {};

        const _sdCount = getRowByChild($row, 3).text().trim();
        sd.count = parseInt(_sdCount.length ? _sdCount : "0");

        const _teamSdCount = getRowByChild($row, 4).text().trim();
        sd.teams = parseInt(_teamSdCount.length ? _teamSdCount : "0");

        // SMP/Mts
        const smp = {};
        
        const _smpCount = getRowByChild($row, 5).text().trim();
        smp.count = parseInt(_smpCount.length ? _smpCount : "0");

        const _teamSmpCount = getRowByChild($row, 6).text().trim();
        smp.teams = parseInt(_teamSmpCount.length ? _teamSmpCount : "0");

        //SMA/SMK
        const sma = {};

        const _smaCount = getRowByChild($row, 7).text().trim();
        sma.count = parseInt(_smaCount.length ? _smaCount : "0");

        const _teamSmaCount = getRowByChild($row, 8).text().trim();
        sma.teams = parseInt(_teamSmaCount.length ? _teamSmaCount : "0");

        // Kalkulasi
        obj.sd.siswa += sd.count;
        obj.sd.teams += sd.teams;
        obj.smp.siswa += smp.count;
        obj.smp.teams += smp.teams;
        obj.sma.siswa += sma.count;
        obj.sma.teams += sma.teams;
        const siswaCount = sd.count + smp.count + sma.count,
        teamCount = sd.teams + smp.teams + sma.teams;


        rows[index] = {
            rank: index + 1,
            provinceId: id,
            name,
            sd, smp, sma,
            total: {
                siswa: siswaCount,
                team: teamCount
            }
        };

        if (kabId) rows[index]["kabId"] = kabId;
    });

    obj.rows = rows;
    return obj;
}

/**
 * Fungsi untuk mendapatkan statistik sekolahan di kabupaten
 * 
 * @param {String} data HTML
 */
function getStatsKabs(data) {
    const $ = cheerio.load(data);
    const rows = [];
    const obj  = {
        siswa: 0,
        team: 0
    };

    if ($("#table-school tbody tr").length == 1 && $("#table-school tbody tr .dataTables_empty").length) return { ...obj, rows };
    obj.last_change = $("h5.text-center").contents().last().text().trim().split("\n")[1].trim();
    $("#table-school tbody tr").each((index, element) => {
        const $row = $(element);
        const name = cleanRow(getRowByChild($row, 2).text());
        const id = parseInt(getParamValue(Request.defaults.baseURL + getRowByChild($row, 2).find("a").attr("href"), "provinsi_id"));
        const kabId = getParamValue(Request.defaults.baseURL + getRowByChild($row, 2).find("a").attr("href"), "kabupaten_id");

        const schTypeId = getParamValue(Request.defaults.baseURL + getRowByChild($row, 2).find("a").attr("href"), "school_type_id");
        const schId = getParamValue(Request.defaults.baseURL + getRowByChild($row, 2).find("a").attr("href"), "school_id");

        const jenjang = $row.find("td").eq(2).text().trim();
        const siswa = parseInt(getRowByChild($row, 4).text().trim());
        const team = parseInt($row.find("td").last().text().trim());

        obj.siswa += siswa;
        obj.team += team;

        rows[index] = {
            name, id, schTypeId, schId, kabId, jenjang, siswa, team
        };
    });

    obj.rows = rows;
    return obj;
}

/**
 * Fungsi untuk mendapatkan teams
 * 
 * @param {String} data HTML
 */
function getTeams(data) {
    const $ = cheerio.load(data);
    const obj = {};
    const rows = [];

    obj.last_change = $("h5.text-center").contents().last().text().trim().split("\n")[1].trim();
    $("#table-peserta tbody tr").each((index, element) => {
        const $r = $(element);

        const code = $r.find("td").eq(1).text().trim();
        const anggota1 = $r.find("td").eq(2).text().trim();
        const anggota2 = $r.find("td").eq(3).text().trim();
        const anggota3 = $r.find("td").eq(4).text().trim();
        const pembimbing = $r.find("td").eq(5).text().trim();
        const waktuDaftar = $r.find("td").eq(6).text().trim();

        rows[index] = { code, anggota1, anggota2, anggota3, pembimbing, waktuDaftar };
    });
    obj.rows = rows;
    return obj;
}

module.exports = { getStatsTable, getStatsKabs, getTeams };