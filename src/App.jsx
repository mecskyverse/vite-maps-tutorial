import React, { useState } from 'react'
// Importing some Hooks and components from google maps api which we will be using during this tutorial
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api'


const libraries = ['places'];
function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const originRef = React.useRef()
  const destinationRef = React.useRef()

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
    libraries: libraries
  })


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Name:', name);
    console.log('Email:', email);
    // Perform submit logic here, such as sending the data to a server
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  console.log(isLoaded)
  // function to calculate Route
  async function calculateRoute(data) {
    console.log(data)
    data.origin = originRef.current.value
    data.destination = destinationRef.current.value
    console.log(data)
    console.log(originRef.current.value)
    if (originRef.current.value === '' && destinationRef.current.value === '') {
      return
    }
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
  }
  // We Have to select some coordinates to give to the map to initially show the map from that point.
  // This are the latitude and longitude of New Delhi, India
  const center = { lat: 28.7041, lng: 77.1025 }


  if (!isLoaded)
    return <div>Loading...</div>


  return (
    <>
      <main className='container'>
        <form className='container-form' onSubmit={handleSubmit} >
          <Autocomplete >
            <input type="text" value={name} onChange={handleNameChange} placeholder='Enter Source' />
          </Autocomplete >

          <br />
          <Autocomplete >
            <input type="email" value={email} onChange={handleEmailChange} placeholder='Enter Destination' />
          </Autocomplete >
          <br />
          <button type="submit">Submit</button>
        </form>

        <div style={{ width: "50vw", height: '100vh' }}>
          <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '2rem' }}
            options={{
              streetViewControl: true,
              zoomControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {console.log(directionsResponse)}
            {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
            <Marker position={center} />
          </GoogleMap>
        </div>

      </main>
    </>
  )
}

export default App
