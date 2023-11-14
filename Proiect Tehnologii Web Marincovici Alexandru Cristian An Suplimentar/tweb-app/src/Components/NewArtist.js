import { Fragment, useState } from 'react'
import { useNavigate } from 'react-router'


function NewArtist() {

    const navigate = useNavigate();
    const [nume, setNume] = useState('')
    const [email, setEmail] = useState('')

    async function addArtist() {

        const newArtist = {
            ArtistName: nume,
            ArtistEmail: email
        }


        try {
            const addNewArtist = await fetch("http://localhost:8080/api/new_artist",
                {

                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newArtist)
                }).then((response) => {

                    response.json().then((resp) => alert(resp))

                    if (response.status === 200) {

                        navigate("/")

                    }

                })

        } catch (err) {

            console.log(err);
        }

    }

    function cancelArtist() {

        navigate("/")

    }

    return (
        <Fragment>

            <div id='titlu_form_add_artist'>
                Adaugare informatii artist nou
            </div>
            <div id='formular'>
                <div>
                    <input type='text' placeholder='Nume' onChange={(event) => setNume(event.target.value)} />
                </div>
                <div>
                    <input type='text' placeholder='Email' onChange={(event) => setEmail(event.target.value)} />
                </div>
                <div>
                    <input type='button' value='Adaugare' onClick={addArtist} />
                    <input type='button' value='Anulare' onClick={cancelArtist} />
                </div>
            </div>

        </Fragment>

    );

}

export default NewArtist;

