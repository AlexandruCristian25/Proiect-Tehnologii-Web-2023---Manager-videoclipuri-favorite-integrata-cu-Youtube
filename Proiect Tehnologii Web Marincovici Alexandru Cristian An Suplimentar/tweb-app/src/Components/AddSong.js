import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

function AddSong() {

    const navigate = useNavigate();
    const id_artist = useLocation()?.state?.IdArtist;

    const [songName, setSongName] = useState('')
    const [views, setViews] = useState(1)
    const [link, setLink] = useState('')
    const [albumName, setAlbumName] = useState('')

    useEffect(function insideEffect() {

        if (id_artist == null) {

            navigate("/");

        }


    }, [id_artist])

    async function add_new_song() {

        const newSong = {

            ArtistID: id_artist,
            SongName: songName,
            Views: views,
            SongLink: link,
            AlbumName: albumName

        }
        
        try {

            await fetch("http://localhost:8080/api/new_song_album", {

                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newSong)
            }).then((response) => {

                if (response.status === 200) {
                    response.json().then((r) => alert(r));
                    navigate(`/Artists/${newSong.ArtistID}`);
                }
                else {
                    response.json().then((r) => alert(r));
                }

            });

        } catch (err) {

            console.log(err);
        }

    }

    function cancel_song() {

        navigate("/Artists/" + id_artist);
    }

    return (
        <Fragment>
            <div id='titlu_form_add_artist'>
                Adaugare informatii meldie noua
            </div>
            <div id='formular'>
                <div>
                    <input type='text' placeholder='Nume melodie' onChange={(event) => setSongName(event.target.value)} />
                </div>
                <div>
                    <input type='text' placeholder='Vizualizari' onChange={(event) => setViews(event.target.value)} />
                </div>
                <div>
                    <input type='text' placeholder='Link' onChange={(event) => setLink(event.target.value)} />
                </div>
                <div>
                    <input type='text' placeholder='Denumire album' onChange={(event) => setAlbumName(event.target.value)} />
                </div>
                <div>
                    <input type='button' value='Adaugare' onClick={add_new_song} />
                    <input type='button' value='Anulare' onClick={cancel_song} />
                </div>
            </div>
        </Fragment>
    );

}

export default AddSong;