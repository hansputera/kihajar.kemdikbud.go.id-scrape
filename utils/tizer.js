/**
 * 
 * @param {String} data Data yang ingin dibersihkan
 * @returns {String} - A string
 */
function cleanRow(data) {
    return data.replace(/(Prov.)|(Kab.)/g, "").trim();
}

/**
 * 
 * @param {String} data Data yang ingin dikeluarkan isiny
 * @param {String} con Data yang ingin dicari
 */
function matchContent(data, con) {
    const strings = data.split(/ +/g);
    for (let index = 0; index < strings.length; index++) {
        if (strings[index].toLowerCase() == con.toLowerCase()) return true;
    }
    return false;
}
module.exports = { cleanRow, matchContent };