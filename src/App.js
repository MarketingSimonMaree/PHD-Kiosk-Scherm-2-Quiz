import { useState, useRef, useEffect } from "react";
import "./styles.css";
import ReactGA from 'react-ga4';
import hotjar from '@hotjar/browser';

function App() {
  const [selectedModal, setSelectedModal] = useState(null);
  const [loopCount, setLoopCount] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const videoRef = useRef(null);
  const lastTimeRef = useRef(0);

  // Video loop patroon configuratie
  const audioLoops = 2;    // Aantal loops met geluid aan
  const muteLoops = 3;     // Aantal loops met geluid uit
  const totalPattern = audioLoops + muteLoops;

  // Start video functie
  const startVideo = async () => {
    if (videoRef.current) {
      try {
        videoRef.current.muted = !audioEnabled;
        videoRef.current.volume = 1;
        await videoRef.current.play();
      } catch (err) {
        console.error("Video start failed:", err);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      // Als de video opnieuw start
      if (currentTime < lastTimeRef.current) {
        const newLoopCount = (loopCount + 1) % totalPattern;
        setLoopCount(newLoopCount);
        
        // Bepaal of audio aan moet staan
        const shouldEnableAudio = newLoopCount < audioLoops;
        setAudioEnabled(shouldEnableAudio);
      }
      lastTimeRef.current = currentTime;
    }
  };

  // Start video wanneer component mount
  useEffect(() => {
    startVideo();
  }, []);

  // Update muted status wanneer audioEnabled verandert
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !audioEnabled;
    }
  }, [audioEnabled]);

  // Initialiseer Google Analytics en Hotjar
  useEffect(() => {
    try {
      console.log('Initializing analytics...');
      ReactGA.initialize('G-380B88GYQS');
      ReactGA.send({ hitType: "pageview", page: window.location.pathname });
      
      console.log('Initializing Hotjar...');
      hotjar.initialize(5329980, 6);
      
      setIsInitialized(true);
      console.log('Initialization complete');
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }, []);

  // Aangepaste event tracking functie voor GA4
  const trackEvent = (eventName, eventParams) => {
    try {
      console.log('Tracking event:', eventName, eventParams);
      ReactGA.event(eventName, {
        ...eventParams,
        nonInteraction: false
      });

      if (window.hj) {
        window.hj('event', eventName);
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  // Aangepaste click handler voor de kaarten
  const handleCardClick = (modalNumber) => {
    setSelectedModal(modalNumber);
    
    let optionName;
    switch(modalNumber) {
      case 1:
        optionName = 'Opdekdeur met stalen kozijn';
        break;
      case 2:
        optionName = 'Houten kozijn';
        break;
      case 3:
        optionName = 'Lege sparing';
        break;
      default:
        optionName = 'Onbekende optie';
    }
    
    // Gedetailleerd event voor optie selectie
    trackEvent('select_option', {
      category: 'Deur Selectie',
      label: optionName,
      value: modalNumber,
      option_type: optionName,
      step: 'initial_selection'
    });
  };

  // Aangepaste button click handler voor de vervolgstappen
  const handleButtonClick = (url, optionName, buttonType) => {
    // Gedetailleerd event voor button clicks
    trackEvent('click_button', {
      category: 'Navigation',
      label: `${optionName} - ${buttonType}`,
      value: 1,
      option_selected: optionName,
      button_type: buttonType,
      destination_url: url,
      step: 'follow_through'
    });

    window.location.href = url;
  };

  const handleVideoLoop = () => {
    setLoopCount(prev => {
      const newCount = (prev + 1) % totalPattern;
      
      // Bepaal of de video gemute moet zijn
      if (videoRef.current) {
        videoRef.current.muted = newCount >= audioLoops;
      }
      
      return newCount;
    });
  };

 const modalContent = {
  1: {
    title: "Een plafondhoge deur is mogelijk bij jou! ",
    content:
      "Wij kunnen in bijna alle gevallen een opdekdeur en stalen kozijn voor onze plafondhoge deur met een houten kozijn. Zelfs als dit niet kamerhoog hoeft te zijn.",
    primaryButton: "Verder gaan",
    primaryUrl: "javascript:window.kiosk.split('https://phd-digitale-adviseur-final-v4-s95f.vercel.app/', 'https://plafondhogedeur.nl/collections/deurmodellen-phd-kiosk');",
    showSecondaryButton: false,
  },
  2: {
    title: "Een plafondhoge deur is alleen mogelijk als ...",
    content:
      "Alleen als u het houten kozijn verwijderd kunnen wij hier onze plafondhogedeur met kozijn in plaatsen. Er zijn echter wel alternatieven voor in het bestaande kozijn. Ga verder en vraag advies aan Joost of neem contact op.",
    primaryButton: "Verder gaan",
    secondaryButton: "Contact voor alternatief",
    primaryUrl: "javascript:window.kiosk.split('https://site.flaire.nl/phd/audio.html', 'https://plafondhogedeur.nl/collections/deurmodellen-phd-kiosk');",
    secondaryUrl: "javascript:window.kiosk.split('https://phd-digitale-adviseur-final-v4-s95f.vercel.app/', 'https://plafondhogedeur.nl/pages/contact');",
    showSecondaryButton: true,
  },
  3: {
    title: "Onze plafondhoge deur is mogelijk",
    content:
      "Bij een lege sparing is onze plafondhoge deur met kozijn vaak wel mogelijk mits dit niet hoger dan 270 cm is of breder dan 105 cm",
    primaryButton: "Verder gaan",
    secondaryButton: "Meer informatie",
    primaryUrl: "javascript:window.kiosk.split('https://digitale-adviseur-phd-kiosk-v1.vercel.app/', 'https://plafondhogedeur.nl/collections/deurmodellen-phd-kiosk');",
    secondaryUrl: "javascript:window.kiosk.split('https://phd-digitale-adviseur-final-v4-s95f.vercel.app/', 'https://plafondhogedeur.nl/pages/contact');",
  },
};

  return (
    <div className="app-container">
      {/* Voeg een basis container toe voor debugging */}
      <div style={{ minHeight: '100vh' }}>
        <div className="video-container">
          <div className="chat-icon">
            <video 
              ref={videoRef}
              className="mini-video" 
              autoPlay 
              loop 
              playsInline
              onTimeUpdate={handleTimeUpdate}
            >
              <source src="https://cdn.shopify.com/videos/c/o/v/03cdcdf1f90c4401aba6b957dfac7290.mp4" type="video/mp4" />
            </video>
            <div className="speaker-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="logo">
            <img
              src="https://plafondhogedeur.nl/cdn/shop/t/2/assets/phd-logo.svg?v=173245948125749905881618906759"
              alt="Logo"
            />
          </div>
          <h1>Selecteer de situatie bij u thuis. Klik op de foto</h1>
          <div className="grid">
            <div className="card" onClick={() => handleCardClick(1)}>
              <img
                src="https://files.widgetic.com/file/widgetic-uploads/app/600ee0c5ecb2a1eb798b456b/ko1bioac-l9ig7n.jpg"
                alt="Opdekdeur"
              />
              <h2>
                Opdekdeur met
                <br />
                stalen kozijn
              </h2>
            </div>
            <div className="card" onClick={() => handleCardClick(2)}>
              <img
                src="https://cdn.shopify.com/s/files/1/0524/8794/6424/files/Houten-Kozijn-4.jpg?v=1732630584"
                alt="Houten kozijn"
              />
              <h2>Houten kozijn</h2>
            </div>
            <div className="card" onClick={() => handleCardClick(3)}>
              <img
                src="https://cdn.shopify.com/s/files/1/0524/8794/6424/files/Kale-Sparing-3.jpg?v=1732630703"
                alt="Lege sparing"
              />
              <h2>Lege sparing</h2>
            </div>
          </div>

          {selectedModal && (
            <div className="modal-overlay" onClick={() => setSelectedModal(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button
                  className="close-button"
                  onClick={() => setSelectedModal(null)}
                >
                  ×
                </button>
                <h2>{modalContent[selectedModal].title}</h2>
                <p>{modalContent[selectedModal].content}</p>
                <div className="button-container">
                  <button
                    className="modal-button primary"
                    onClick={() => handleButtonClick(
                      modalContent[selectedModal].primaryUrl,
                      modalContent[selectedModal].title,
                      'Verder gaan'
                    )}
                  >
                    {modalContent[selectedModal].primaryButton}
                  </button>
                  {modalContent[selectedModal].showSecondaryButton && (
                    <button
                      className="modal-button secondary"
                      onClick={() => handleButtonClick(
                        modalContent[selectedModal].secondaryUrl,
                        modalContent[selectedModal].title,
                        'Secundaire optie'
                      )}
                    >
                      {modalContent[selectedModal].secondaryButton}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
