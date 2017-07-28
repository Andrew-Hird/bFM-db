const json = require('./convertcsv.json')

let db = []

    json.forEach((album, i) => {
        let keys = Object.keys(album)

        const trackKeys = keys.filter(k => k === 'Tracks' || k === setFields(10, 48, k))
        // const trackKeys = keys.filter(key => key === 'Tracks' || key === trackField(key))
        // function trackField (k) {
        //     for (let i = 10; i <= 48; i++) {
        //         if (k === (`FIELD${i}`)) {
        //             return k
        //         }
        //     }
        // }

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
        // const goldKeys = keys.filter(k => k === 'Gold?' || k === goldField(k))
        // function goldField (k) {
        //     for (let i = 50; i <= 88; i++) {
        //         if (k === (`FIELD${i}`)) {
        //             return k
        //         }
        //     }
        // }

        goldKeys.forEach((k, i) => {
            if (album[k]) {
                tracks[i].gold =  booleanSwap(album[k], 'Gold?')
            }
        })

        const scratchedKeys = keys.filter(k => k === 'Scratched?' || k == setFields(k, 90, 128))
        // const scratchedKeys = keys.filter(k => k === 'Scratched?' || k == scratchField(k))
        // function scratchField (k) {
        //     for (let i = 90; i <= 128; i++) {
        //         if (k === (`FIELD${i}`)) {
        //             return k
        //         }
        //     }
        // }

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

        console.log(`${i + 1} of ${json.length}`)
    })
    console.log(JSON.stringify(db, null, 4))
