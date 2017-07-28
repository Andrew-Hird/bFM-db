var json = require('./convertcsv.json')

var db = []

    json.forEach((album, index) => {
        var keys  = Object.keys(album)

        keysFiltered = keys.filter(key => {
            return album[key] !== '' || key === 'Tracks' || key === 'Gold?'
        })
        
        trackKeys = keysFiltered.filter(key => {
            return key === "Tracks" || key === trackField(key)
        })

        function trackField(key) {
            for (var i = 10; i <= 48; i++) {
                if (key === (`FIELD${i}`)) {
                    return key
                }
            }
        }

        var tracks = []

        trackKeys.forEach((track, i) => {
            tracks.push({[i + 1]: album[track]})
        })

        // console.log(tracks)

        db.push({
            catalogNumber: album["Catalog Number"],
            media: album["Media"],
            origin: album["Origin"],
            artist: album["Artist"],
            albumName: album["Album Name"],
            releaseYear: album["Release Year"],
            genre: album["Genre"],
            recordLabel: album["Record Label"],
            tracks: tracks
        })
    })
    console.log(JSON.stringify(db, null, 4))