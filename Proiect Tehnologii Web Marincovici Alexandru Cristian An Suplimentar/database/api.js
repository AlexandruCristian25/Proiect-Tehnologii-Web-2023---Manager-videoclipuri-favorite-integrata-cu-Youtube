import "./sync.js";
import {router} from "../server-init.js"
import { OperatiiApi } from "./operation-api.js";

/*Afisare lista Artisti si melodiile aferente*/
router.route("/songs").get(async function GetArtistAndSongs(_, response) {

    try {
        const result = await OperatiiApi.getArtistAndSongs();
        response.status(200).json(result);
    }
    catch (err) {

        console.log(err);

    }
});


/*Afisare informatii despre un artist - lucrari*/
router.route("/Artist/:artist_id").get(async function GetInfoArtist({ params: { artist_id } }, response) {

    try {
        const result = await OperatiiApi.getInfoArtist(+artist_id);
        response.status(result[0]).json(result[1]);

    } catch (err) {

        console.log(err);

    }

});


/*Adaugare Artist*/
router.route("/new_artist").post(async function AddNewArtist({ body }, response) {

    try {

        const result = await OperatiiApi.addNewArtist(body);
        response.status(result[0]).json(result[1]);

    } catch (err) {

        console.error(err);
    }

});


/*Adaugare melodie si album nou*/
router.route("/new_song_album").post(async function AddNewSongAndAlbum({ body }, response) {

    try {

        const result = await OperatiiApi.addNewSongAndAlbum(body);
        response.status(result[0]).json(result[1]);

    } catch (err) {
        console.log(err);
    }

});

/*Actualizare melodie*/
router.route("/update_songs/:song_id").put(async function UpdateSongs({ params: { song_id }, body }, response) {

    try {

        const result = await OperatiiApi.updateSongs(+song_id, body);
        response.status(result[0]).json(result[1]);

    } catch (err) {

        console.error(err);
    }
});

/*Stergere melodie*/
router.route("/delete_song/:song_id").delete(async function DeleteSong({ params: { song_id } }, response) {

    try {

        const result = await OperatiiApi.deleteSong(+song_id);
        response.status(result[0]).json(result[1]);

    } catch (err) {

        console.log(err);
    }


})

/*Stergere Album (daca albumul are melodii inregistrate atunci nu se poate sterge albumul)*/
router.route("/delete_album/:album_id").delete(async function DeleteAlbum({ params: { album_id } }, response) {

    try {

        const result = await OperatiiApi.deleteAlbum(album_id);
        response.status(result[0]).json(result[1]);

    } catch (err) {

        console.log(err);
    }


});
