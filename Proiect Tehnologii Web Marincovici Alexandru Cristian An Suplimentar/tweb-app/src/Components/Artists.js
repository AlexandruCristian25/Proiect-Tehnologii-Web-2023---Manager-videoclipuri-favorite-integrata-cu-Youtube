import { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress } from "@material-ui/core"

function Artists() {

    const [artists, setArtists] = useState({
        info: {},
        loaded: false,
        loading: false
    });

    async function getArtists() {

        setArtists(function setState(prevState) {

            return { ...prevState, loading: true };

        })

        try {

            const artisti = await fetch("http://localhost:8080/api/songs");
            const info_artisti = await artisti.json();
            if (artisti.ok) {
                setArtists({

                    info: info_artisti,
                    loaded: true,
                    loading: false
                });

            }
            else {
                console.log(info_artisti);
            }

        } catch (err) {

            alert("Eroare de conexiune la baza de date");
        }
    }


    useEffect(function insideEffect() {

        if (!artists.loaded) {


            getArtists();
        }

    }, [artists.loaded])

    return (
        <Fragment>
            {artists.loading && <CircularProgress />}
            {artists.loaded &&

                < table id="ListOfArtists">
                    <caption>Lista artisti inregistrati in baza de date</caption>
                    <thead>
                        <tr>
                            <th>Nume</th>
                            <th>Email</th>
                            <th>Optiuni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {artists.info.map((e) => {

                            return (

                                <tr key={e.ArtistID}>
                                    <td>{e.Name}</td>
                                    <td>{e.Email}</td>
                                    <td><Link to={`/Artists/${e.ArtistID}`} state={{ artistID: e.ArtistID }} > Detalii</Link></td>
                                </tr>

                            );

                        })}
                    </tbody>
                </table>

            }
        </Fragment >
    );

}

export default Artists;