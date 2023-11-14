import { useParams } from 'react-router-dom'
import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Button, CircularProgress } from '@material-ui/core';


function Artist() {

    const parametrii = useParams();
    const navStyleState_work = useState({ color: "white", backgroundColor: "green" })
    const navStyleState_delete = useState({ color: "white", backgroundColor: "red" })

    //Setari info melodie
    const [idSong, setIdSong] = useState(-1)
    const [songName, setSongName] = useState('')
    const [songViews, setSongViews] = useState('')
    const [songLink, setSongLink] = useState('')

    //Setari info Album
    const [albumID, setAlbumID] = useState(-1)


    const [artist, setArtist] = useState({

        info: {},
        loaded: false,
        loading: false
    });

    async function getArtistById() {

        setArtist(function setState(prevState) {

            return { ...prevState, loading: true };

        })

        try {

            const artist = await fetch(`http://localhost:8080/api/Artist/${parametrii.id_artist}`);
            const info_artist = await artist.json();
            if (artist.ok) {
                setArtist({

                    info: info_artist,
                    loaded: true,
                    loading: false
                });
            }
            else {
                alert(info_artist);

            }

        } catch (err) {

            setArtist(function setState(prevState) {
                return { ...prevState, loading: false, loaded: false };
            });

            alert("Eroare de conexiune la baza de date");

        }
    }

    function setSongDetails(melodie) {
        setIdSong(melodie.SongID)
        setSongName(melodie.Name)
        setSongLink(melodie.Link)
        setSongViews(melodie.Views)
    }

    async function update_song() {

        const new_song = {
            Name: songName,
            Views: songViews,
            Link:songLink

        }

        await fetch(`http://localhost:8080/api/update_songs/${idSong}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(new_song)
        }).then((response) => {

            response.json().then((resp) => alert(resp)).then(_ => {

                setIdSong(-1)
                setSongViews('')
                setSongLink('')
                setSongName('')
                window.location.reload()

            })

        }).catch(err => console.log(err))
    }

    async function delete_album(album) {

        await fetch(`http://localhost:8080/api/delete_album/${album.AlbumID}`, {

            method: "DELETE",
            headers: {
                "Contect-Type": "application/json"
            }
        }).then((response) => {

            response.json().then((resp) => alert(resp)).then(_ => {
                console.log(albumID)

                setAlbumID(-1)
                window.location.reload()

            }).catch(err => console.log(err))

        })
    }

    async function delete_song(melodie) {

        await fetch(`http://localhost:8080/api/delete_song/${melodie.SongID}`, {

            method: "DELETE",
            headers: {
                "Contect-Type": "application/json"
            }
        }).then((response) => {

            response.json().then((resp) => alert(resp)).then(_ => {

                //setAlbumID(-1)
                window.location.reload()

            }).catch(err => console.log(err))

        })
    }

    useEffect(function insideEffect() {

        if (!artist.loaded) {

            getArtistById();
        }

    }, [artist.loaded])

   

    return (<Fragment>

        {artist.loading && <CircularProgress />}
        {artist.loaded &&

            <table id="ListOfSongs">
                <caption>Detalii melodie artist <i>{artist.info[0].Name}</i>
                    <div id='link_add_song'>
                        <Link to="/AddSong" style={{ textDecoration: "none", color: "white" }}
                            state={{ IdArtist: parametrii.id_artist }}>
                            Adaugare melodie noua
                        </Link>
                    </div>
                </caption>
                <tbody>
                    {artist.info.map((e) => {
                        return (e.Albums.map((album) => {
                            return (
                                <Fragment key={album.AlbumID}>
                                    <tr>
                                        <td >Album : </td>
                                        <td colSpan={5}><b>{album.Name}</b></td>
                                        <td>
                                            <Button
                                                style={navStyleState_delete[0]}
                                                onClick={function onClick() {

                                                    delete_album(album);

                                                }}
                                            >
                                                Sterge
                                            </Button>
                                        </td>
                                        <td></td>
                                    </tr>
                                    {
                                        album.Songs.map((melodie) => {
                                            return (
                                                <Fragment key={melodie.SongID}>
                                                    <tr>
                                                        <td style={{ paddingLeft: "25px", width:"100px" }}>Melodie :</td>
                                                        <td style={{width:"150px"}}>
                                                            {
                                                                (idSong === melodie.SongID) ?
                                                                    (<input style={{ width: "100px" }} type="text" defaultValue={melodie.Name} onChange={(event) => {
                                                                        setSongName(event.target.value)
                                                                    }} />)
                                                                    :
                                                                    (<b>{melodie.Name}</b>)
                                                            }
                                                        </td>
                                                        <td style={{ paddingLeft: "25px", width:"100px" }}>Link :</td>
                                                        <td style={{width:"150px"}}>
                                                            {
                                                                (idSong === melodie.SongID) ?
                                                                    (<input style={{ width: "100px" }} type="text" defaultValue={melodie.Link} onChange={(event) => {
                                                                        setSongLink(event.target.value)
                                                                    }} />)
                                                                    :
                                                                    (<b>{melodie.Link}</b>)
                                                            }
                                                        </td>
                                                        <td style={{ paddingLeft: "25px",width:"150px" }}>Vizualizari :</td>
                                                        <td style={{width:"150px"}}>
                                                            {
                                                                (idSong === melodie.SongID) ?
                                                                    (<input style={{ width: "100px" }} type="text" defaultValue={melodie.Views} onChange={(event) => {
                                                                        setSongViews(event.target.value)
                                                                    }} />)
                                                                    :
                                                                    (<b>{melodie.Views}</b>)
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                <Button
                                                                    style={navStyleState_work[0]}
                                                                    onClick={function onClick() {

                                                                        (idSong === melodie.SongID) ?
                                                                            update_song()
                                                                            :
                                                                            setSongDetails(melodie) //incarcare valori default pentru lucrare in setState


                                                                    }}>
                                                                    {(idSong !== melodie.SongID) ?
                                                                        "Editare" : "Salvare"
                                                                    }
                                                                </Button>}
                                                        </td>
                                                        <td>
                                                            {<Button
                                                                style={navStyleState_delete[0]}
                                                                onClick={function onClick() {

                                                                    delete_song(melodie)

                                                                }}
                                                            >
                                                                Sterge
                                                            </Button>}
                                                        </td>
                                                    </tr>
                                                </Fragment>
                                            )
                                        })
                                    }
                                </Fragment>
                            )
                        }))
                    })}
                </tbody>
            </table>}

    </Fragment >);

}

export default Artist;