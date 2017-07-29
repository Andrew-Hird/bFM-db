const StreamArray = require('stream-json/utils/StreamArray');
const path = require('path');
const fs = require('fs');

let jsonStream = StreamArray.make();

let db = []
jsonStream.output.on('data', function ({index, value}) {
    
    let i = index
    let album = value
    let keys = Object.keys(album)

    const trackKeys = keys.filter(k => k === 'Tracks' || k === setFields(10, 48, k))

    const tracksCleaned = trackKeys.filter(k => album[k] !== '')

    let tracks = []
    tracksCleaned.forEach((track, i) => {
        tracks.push({
            trackNumber: i + 1,
            trackName: album[track],
            gold: false,
            scratched: false
        })
    })

    const goldKeys = keys.filter(k => k === 'Gold?' || k === setFields(50, 88, k))

    goldKeys.forEach((k, i) => {
        if (album[k]) {
            if (tracks[i]) {
                tracks[i].gold = booleanSwap(album[k], 'Gold?')
            }
        }
    })

    const scratchedKeys = keys.filter(k => k === 'Scratched?' || k == setFields(k, 90, 128))

    scratchedKeys.forEach((k, i) => {
        if (album[k]) {
            tracks[i].scratched = booleanSwap(album[k], 'Scratched?')
        }
    })

    function setFields (start, stop, key) {
        for (let i = start; i <= stop; i ++) {
            if (key === (`FIELD${i}`)) {
                return key
            }
        }
    }

    function booleanSwap (val, type) {
        if (val === 'Yes') {
            return true
        } else if (val === '') {
            return false
        } else {
            throw `error: Catalog Number ${album['Catalog Number']} - ${album['Artist']} - ${album['Album Name']} | '${type}' - '${val}' value not expected`
        }
    }

    db.push({
        catalogNumber: album['Catalog Number'],
        media: album['Media'],
        origin: album['Origin'],
        artist: album['Artist'],
        albumName: album['Album Name'],
        releaseYear: album['Release Year'],
        genre: album['Genre'],
        recordLabel: album['Record Label'],
        missing: booleanSwap(album['Missing?'], 'Missing?'),
        spineNeeded: booleanSwap(album['Spine Needed?'], 'Spine Needed?'),
        countRecords: booleanSwap(album['Count Records'], 'Count Records'),
        aristToo: album['Artist too'],
        albumToo: album['Album too'],
        tracks: tracks
    })

    console.log(`processing bFM database ${i + 1} of 18268`)

})

jsonStream.output.on('end', function () {
    console.log('All done');
    fs.writeFileSync('output.json', JSON.stringify(db), 'utf8')
});

let filename = path.join(__dirname, 'bfm.json');

fs.createReadStream(filename).pipe(jsonStream.input);
