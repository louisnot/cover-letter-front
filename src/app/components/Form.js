'use client'

import React, {useState, useRef, useEffect} from "react";
import axios from "axios";
import styles from '../styles.module.css'
import Spinner from "./Spinner";
import API_URL from '../config.js';

export default function Form() {

    const [infoUser, setInfoUser] = useState({
        "name":'',
        "company" :'',
        "position" :'',
        "experience" : '',
        "education" : ''
    })

    const [language, setLanguage] = useState("English");

    const [resumeDone, setResumeDone] = useState(false);

    const [loading, setLoading] = useState(false);

    const [letterLoading, setLetterLoading] = useState(false);

    const [letter, setLetter] = useState('');

    const textAreaRef = useRef(null);

    const [errorMsg, setErrorMsg] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault()
        setLetterLoading(true)
        const data = {
            name: infoUser.name,
            education: infoUser.education,
            experience: infoUser.experience,
            position: infoUser.position === undefined ? 'Spontaneous' : infoUser.position,
            company: infoUser.company === undefined ? '' : infoUser.company
        }
        console.log(data)
        axios.post(`${API_URL}/create-letter`, data, {params : {lng : language}})
        .then((response) => {
            console.log(response.data)
            let letterGenerated = ""
            response.data.map((elem, index) => {
                letterGenerated += elem.content;
            })
            setLetter(letterGenerated)
            setErrorMsg(null)
        })
        .catch((err) => {
            // console.log(err);
            setErrorMsg(err.message);
        })
        .finally( () => {
            setLetterLoading(false);
        })
    }

    const resizeTextArea = () => {
        if(letter){
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
        }
    }

    useEffect(resizeTextArea, [letter])

    const onLetterChange = e => {
        setLetter(textAreaRef.current.value);
    }
    
    const handleChange = (e) =>{
        const {name, value} = e.target
        setInfoUser({...infoUser, [name]:value})
    }

    const handleFileChange = (e) => {
        setLoading(true);
        let file = e.target.files[0]
        const formData = new FormData()
        formData.append('file', file)
        axios.post(`${API_URL}/parse-resume`, formData,
        {
            headers : {
            'Content-type': 'multipart/form-data',
            }
        }
        )
        .then((response) => {
            setResumeDone(true);
            setInfoUser({
                name: response.data.names[0],
                education: response.data.education,
                experience: response.data.skills
            })
            setErrorMsg(null)
        })
        .catch( (err) => {
            // console.log(err)
            setErrorMsg(err.message)  
        })
        .finally(() => {
            setLoading(false);
        })
      };

      const downloadLetter = (text) => {
        const link = document.createElement("a")
        link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        link.setAttribute('download', 'letter.txt');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click()
        document.body.removeChild(link)
      }

    return(
        <main className={`mb-3 text-sm font-semibold`}>
            {errorMsg ?       
                <div className={styles.error}>
                    <p>{errorMsg}</p>
                </div> : null}
            <div className={styles.maindiv}>
                {loading ? <Spinner /> : <form onSubmit={handleSubmit}>
                    {!resumeDone ? <div>
                        <label htmlFor="file" style={{marginBottom:'0.5rem', display:'block'}}>
                            Upload Resume
                        </label>
                        <input
                        className={styles.inputstyle}
                        type="file"
                        name="file"
                        onChange={handleFileChange}
                        style={{ marginBottom: '0.5rem' }}
                        />
                    </div>
                    :<div>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input
                        type="text"
                        name="name"
                        className={styles.inputstyle}
                        value={infoUser.name || ''}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div>
                        <label htmlFor="message">Past experiences:</label>
                        <textarea
                        name="experience"
                        value={infoUser.experience  || ''}
                        className={styles.inputstyle}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div>
                        <label htmlFor="message">Education (school and major):</label>
                        <textarea
                        name="education"
                        value={infoUser.education  || ''}
                        className={styles.inputstyle}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div>
                        <label htmlFor="name">Company you want to work for:</label>
                        <input
                        type="text"
                        name="company"
                        className={styles.inputstyle}
                        value={infoUser.company  || ''}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div>
                        <label htmlFor="name">Specific position you are applying to (if spontaneous leave it blank):</label>
                        <input
                        type="text"
                        name="position"
                        value={infoUser.position  || ''}
                        className={styles.inputstyle}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <select  value={language} className={styles.select} onChange={(e) => {setLanguage(e.target.value)}}>
                        <option value="French">French</option>
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                    </select>
                    <button disabled={letterLoading} className={letterLoading ? styles.disabled : styles.button} type="submit">
                        Generate letter
                    </button>
                </div>
                }
                </form>
                }
            </div>
            {letter ? <div style={{marginTop: '2rem'}} className={styles.maindiv}>
                <h2 style={{ paddingBottom:'1rem'}}> Letter generated :</h2>
                <textarea style={{ paddingBottom:'2rem'}} ref={textAreaRef} value={letter} onChange={onLetterChange}id="letter" />
                <button onClick={() => downloadLetter(letter)} className={styles.button}>
                        Download
                </button>
            </div> : !letter && letterLoading ? <div style={{padding: '3rem'}}><p style={{paddingBottom: '1.5rem'}}>We are generating your letter please stay with us...</p> <Spinner /> </div>: null}
        </main>
    )
}
