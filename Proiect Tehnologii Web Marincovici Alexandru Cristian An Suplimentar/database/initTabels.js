import { Songs } from "./sync.js";
import { Artist } from "./sync.js";
import { Album } from "./sync.js";

export const initTabels = async function PopulateDatabase() {

    try {

        await Artist.create({

            Name: "Artist 1",
            Email: "abc@yahoo.com"
        });
        await Artist.create({

            Name: "Artist 2",
            Email: "def@gmail.com"
        });
        await Artist.create({

            Name: "Artist 3",
            Email: "klm@yahoo.com"
        });

        await Album.create({

            Name: "Album 1",
            IDArtist: 1
        });
        await Album.create({

            Name: "Album 2",
            IDArtist: 2
        });
        await Album.create({

            Name: "Album 3",
            IDArtist: 3
        });

        await Songs.create({

            Views: 25,
            Name: "Song 1",
            Link: "Link 1",
            Artist_ID: 1,
            Album_ID: 1
        });
        await Songs.create({

            Views: 5,
            Name: "Song 2",
            Link: "Link 2",
            Artist_ID: 2,
            Album_ID: 2
        });
        await Songs.create({

            Views: 10,
            Name: "Song 3",
            Link: "Link 3",
            Artist_ID: 3,
            Album_ID: 3
        });
        await Songs.create({

            Views: 100,
            Name: "Song 4",
            Link: "Link 4",
            Artist_ID: 1,
            Album_ID: 2
        });
        await Songs.create({

            Views: 1,
            Name: "Song 5",
            Link: "Link 5",
            Artist_ID: 1,
            Album_ID: 3
        });


    } catch (err) {

        console.error("A intervenit o eroare la popularea tabelelor!")

    }

}