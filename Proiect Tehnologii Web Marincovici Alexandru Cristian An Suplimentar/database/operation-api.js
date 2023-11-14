import { Songs } from "./sync.js";
import { Artist } from "./sync.js";
import { Album } from "./sync.js";
import {initTabels} from "./initTabels.js";

async function SequelizeAuth(sequelizeConection) {
    try {
        await sequelizeConection.authenticate();
        console.log("S-a realizat conexiunea la baza de date!");
    }
    catch (err) {
        console.log("A survenit o eroare la conexiunea bazei de date!");
    }
}
async function SequelizeSync(sequelizeConection) {
    try {
        await sequelizeConection.sync({
            force: false,
            alter: true
        });
        console.log("S-a realizat sincronizarea cu baza de date!");
    }
    catch (err) {
        console.log("A intervenit o eroare la sincronizarea cu bazei de date!");
    }
}

async function SequelizeInit(sequelizeConectionInfo) {
    await SequelizeAuth(sequelizeConectionInfo);
    await SequelizeSync(sequelizeConectionInfo);
    await initTabels();
}

async function GetArtistAndSongs() {

    try {

        return await Artist.findAll({

            include: [{
                model: Songs,
            }],

            order: ['ArtistID'],
        });

    } catch (err) {

        console.error(err);
    }

}

async function GetInfoArtist(artist_id) {

    /*Verificam daca exista in baza de date artistul cu ID-ul introdus*/

    let exit_msg = Array(2);
    if (isNaN(artist_id)) {

        exit_msg[0] = 400;
        exit_msg[1] = "ID-ul introdus nu este un numar valid!"
        return exit_msg;

    } else {
        const ArtistRowId = await Artist.findAll({
            where: { ArtistID: artist_id }
        });

        if (ArtistRowId.length == 0) {

            exit_msg[0] = 400;
            exit_msg[1] = `Nu exita in baza de date Artistul cu ID-ul = ${artist_id}!`;
            return exit_msg;
        }
    }

    try {
        exit_msg[0] = 200;
        exit_msg[1] = await Artist.findAll({

            include: [
                {
                    model: Album,
                    include: [{
                        model: Songs,
                    }]
                }
            ],
            where: { ArtistID: artist_id }
        });
        return exit_msg;

    } catch (err) {
        console.error(err);
    }
}

async function AddNewArtist(body) {

    let exit_msg = Array(2);

    //Verificam daca informatiile introduse sunt corecte
    if (Object.keys(body).length == 0) {

        exit_msg[0] = 400;
        exit_msg[1] = "Lipseste corpul mesajului! Nu exista informatii necesare inregistrarii in baza de date!"
        return exit_msg;

    } else if (!body.ArtistName || !body.ArtistEmail || body.ArtistName.trim().length == 0 || body.ArtistEmail.trim().length == 0) {

        exit_msg[0] = 400;
        exit_msg[1] = "Lipsesc Numele si/sau adresa de email a artistului!"
        return exit_msg;

    }
    else {
        try {
            await Artist.create({

                Name: body.ArtistName,
                Email: body.ArtistEmail

            });

            exit_msg[0] = 200;
            exit_msg[1] = "Datele au fost adaugate cu succes!"
            return exit_msg;

        } catch (err) {

            if (err.name == "SequelizeUniqueConstraintError") {

                exit_msg[0] = 400;
                exit_msg[1] = "Nu se pot introduce in baza de date doi artisti cu acelasi nume si aceeasi adresa de email!"
                return exit_msg;

            }
        }
    }

}


async function AddNewSongAndAlbum(body) {

    /* Se verifica daca denumirea este valilda sau exista id-u artist*/
    let exit_msg = Array(2);

    if (Object.keys(body).length == 0) {

        exit_msg[0] = 400;
        exit_msg[1] = "Lipseste corpul mesajului! Nu exista informatii necesare inregistrarii in baza de date"


    } else if (!body.ArtistID || isNaN(body.ArtistID) || body.ArtistID < 0) {

        exit_msg[0] = 400;
        exit_msg[1] = "ID-ul artistului nu este valid sau lipseste!"

    } else if (!body.SongName || !body.AlbumName || body.SongName.trim().length == 0 
        || body.AlbumName.trim().length == 0 || !body.SongLink ||body.SongLink.trim().length == 0 ) {

        exit_msg[0] = 400;
        exit_msg[1] = "Lipsesc datele despre melodie sau numele albumului!";

    } else if (body.Views < 0 || isNaN(body.Views)) {

        exit_msg[0] = 400;
        exit_msg[1] = "Numarul de vizualizari nu este valid!"

    } else {

        //Se verifica daca exista in baza de date ID-ul artistului
        const RowArtistId = await Artist.findAll({
            where: { ArtistID: body.ArtistID }
        })

    
        if (RowArtistId.length == 0) {

            exit_msg[0] = 400;
            exit_msg[1] = `Nu exista Artist cu ID = ${body.ArtistID}`;

        } else {


            let id_album = 0;

            const RowAlbumId = await Album.findAll({
                where: { Name: body.AlbumName }
            })

            //Se verifica daca albumul este deja inregistrat in baza de date
            if (RowAlbumId.length != 0 ) {

              //Daca albumul este inregistrat se extrasge ID-ul albumului existent
              id_album = RowAlbumId[0].AlbumID

            }
            else 
            {
                await Album.create({

                    //Daca albumul nu este inregistrat seinregistreaza albumul si se  extrasge ID-ul noului album 
                    Name: body.AlbumName,
                    IDArtist: body.ArtistID
                }).then(result => id_album = result.AlbumID);
            }

                //Dupa ce se creeaza albumul si se obtine id-ul se inregistreaza si lucrarea in baza de date
                await Songs.create({

                    Views: body.Views,
                    Name: body.SongName,
                    Link: body.SongLink,
                    Artist_ID: body.ArtistID,
                    Album_ID: id_album
                });

                exit_msg[0] = 200;
                exit_msg[1] = "Album si melodie adaugate cu succes!";

        }

    }

    return exit_msg;

}

async function UpdateSongs(song_id, body) {

    let exit_msg = Array(2);

    //Se verifica daca s-a primit un "corp" valid
    if (Object.keys(body).length == 0) {

        exit_msg[0] = 400;
        exit_msg[1] = "Lipseste corpul mesajului! Nu exista informatii necesare inregistrarii in baza de date"

    } else if (isNaN(body.Views) || body.Views < 0) {

        /*Verificare daca Id-ul melodiei este numar valid sau al unei inregistrari existente in baza de date*/
        exit_msg[0] = 400;
        exit_msg[1] = "Introduceti un numar de vizualizari valid si pozitiv";

    } else {

        if (isNaN(song_id)) {

            exit_msg[0] = 400;
            exit_msg[1] = "Introduceti un ID valid!";
        }
        else {
            const SongRowId = await Songs.findAll({
                where: { SongID: song_id }
            });

            if (SongRowId.length == 0) {

                exit_msg[0] = 400;
                exit_msg[1] = "ID-ul nu este inregistrat in baza de date";
            } else {

                /*Verificare daca titlul melodiei este valid si daca nr de vizualizari este numar*/

                if (!body.Name || body.Name.trim().length == 0 || !body.Link || body.Link.trim().length == 0) {

                    exit_msg[0] = 400;
                    exit_msg[1] = "Introduceti un titlu sau un link valid!"

                }
                else {

                    try {
                        const SongRowId = await Songs.findByPk(song_id);
                        await SongRowId.update({

                            Name: body.Name,
                            Views: body.Views,
                            Link: body.Link
                        });

                        exit_msg[0] = 200;
                        exit_msg[1] = "Datele melodiei au fost actualizate cu succes!"

                    } catch (err) {


                        exit_msg[0] = 400;
                        exit_msg[1] = "A interventi o eroare la actualizarea melodiei!";
                    }
                }

            }
        }

    }

    return exit_msg;
}


async function DeleteSong(song_id) {

    let exit_msg = Array(2);

    if (isNaN(song_id)) {

        exit_msg[0] = 400;
        exit_msg[1] = "ID-ul nu este valid !";
    }
    else {

        /*se verfica daca ID-ul este valid si exista in baza de date*/
        const SongRowId = await Songs.findAll({
            where: { SongID: song_id }
        })

        if (SongRowId.length == 0) {
            exit_msg[0] = 400;
            exit_msg[1] = "Nu exista inregistrarea in baza de date";
        }
        else {

            const SelectedRow = await Songs.findByPk(song_id);

            await SelectedRow.destroy();

            exit_msg[0] = 200
            exit_msg[1] = "Melodia a fost stearsa din baza de date";

        }
    }

    return exit_msg;
}


async function DeleteAlbum(album_id) {

    /*Se verifica daca ID-ul albumului este un numar valid sau exista in baza de date*/
    let exit_msg = Array(2);
    if (isNaN(album_id)) {

        exit_msg[0] = 400;
        exit_msg[1] = "ID-ul nu este valid! Introduceti un ID valid!";

    } else {

        //Se verifica daca exista ID-ul in baza de date si se selecteaza cu tot cu lucrarile aferente 
        //pentru verificari ulterioare
        const AlbumRowId = await Album.findByPk(album_id, {
            include: [{ model: Songs }],
        })

        if (AlbumRowId == null) {

            exit_msg[0] = 400;
            exit_msg[1] = "ID-ul introdus nu exista in baza de date!";
        } else {

            if (AlbumRowId.Songs.length != 0) {

                exit_msg[0] = 400;
                exit_msg[1] = "Albumul are melodii inregistrate!. NU se poate sterge din baza de date!";

            }
            else {

                await AlbumRowId.destroy();
                exit_msg[0] = 200;
                exit_msg[1] = "Albumul a fost sters din baza de date! "
            }

        }

    }

    return exit_msg;

}

export const OperatiiApi = {
    init: SequelizeInit,
    getArtistAndSongs: GetArtistAndSongs,
    getInfoArtist: GetInfoArtist,
    addNewArtist: AddNewArtist,
    addNewSongAndAlbum: AddNewSongAndAlbum,
    updateSongs: UpdateSongs,
    deleteSong: DeleteSong,
    deleteAlbum: DeleteAlbum
}