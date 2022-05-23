import React, {useState, useEffect, useRef} from 'react'
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo'
const clientID = `?client_id=${process.env.REACT_APP_UNSPLASH_CLIENT_ID}`
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {

  const [photos,setPhotos] = useState([])
  const [newImages, setNewImages] = useState(false)
  const [loading,setLoading] = useState(false)
  const [page,setPage] = useState(1)
  const [query,setQuery] = useState('');

  const mounted = useRef(false);

  const fetchImages = async () => {

  setLoading(true);

    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;
    let url;
    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`
    } else {
      url = `${mainUrl}${clientID}${urlPage}`
    }

    try {
      const response = await fetch(url)
      const data = await response.json()
      setPhotos((oldPhotos)=> {
        if (query && page ===1) { // if we searched for something and we already
          return data.results;
        }
        else if (query) { // we have a query with more than page 1
                    //therefore we append the results to the old array of results
          return [...oldPhotos, ...data.results];
        } // we don't have a query, we just append new images to existing array
         else {
          return [...oldPhotos,...data]
        }

      });
      setNewImages(false);
      setLoading(false)
    }catch (error) {
      setNewImages(false);
      setLoading(false)
    }
  }
  // handles the form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!query) return;
    if (page === 1 ) {
      fetchImages()
      return;
    }
    setPage(1)

  }

  // initial render and every time we update page state
  useEffect(() => {
    fetchImages();
  },[page])

  // all other renders except the first one
  useEffect(()=> {
    if (!mounted.current)  {
      mounted.current = true;
      return
    }
    if (loading) return;
    if (!newImages) return;
    setPage((oldPage) => {
      return oldPage+1;
    })
  }, [newImages])

  const event = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight -2) {
      setNewImages(true);
    }
  }
  useEffect(()=> {
     window.addEventListener('scroll',event)
    return ()=> window.removeEventListener('scroll', event);
  }, [])

  // useEffect(() => {
  //
  //   const event = window.addEventListener('scroll' , ()=> {
  //     if (!loading && (window.innerHeight + window.scrollY) >= document.body.scrollHeight - 2) {
  //         setPage((oldValue) => {
  //           return oldValue + 1;
  //         })
  //     }
  //
  //   });
  //   return () => window.removeEventListener('scroll' , event);
  // }, [])


  
  return <main>
    <section className={"search"}>
      <form className="search-form">
        <input type="text" value={query} onChange={(e)=> setQuery(e.target.value)} placeholder={"search"} className={"form-input"}/>
        <button type="submit" className={"submit-btn"} onClick={handleSubmit}><FaSearch/></button>
      </form>
    </section>
    <section className={"photos"}>
      <div className={"photos-center"}>
        {photos.map((photo,index)=> {
         return <Photo key={index} {...photo} />
        })}
      </div>
      {loading && <h2 className={"loading"}>Loading...</h2>}
    </section>
  </main>
}

export default App
