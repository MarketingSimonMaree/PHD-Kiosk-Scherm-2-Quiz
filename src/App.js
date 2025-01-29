import { useState } from "react";
import "./styles.css";

function App() {
  const [selectedModal, setSelectedModal] = useState(null);

  // Voeg deze functie toe
  const handleButtonClick = (url) => {
    window.location.href = url;
  };

  const modalContent = {
    1: {
      title: "Een plafondhoge deur is mogelijk bij jou! ",
      content:
        "Wij kunnen in bijna alle gevallen een opdekdeur en stalen kozijn voor onze plafodhoge deur met een houten kozijn. Zelfs als dit niet kamerhoog hoeft te zijn.",
      primaryButton: "Verder gaan",
      primaryUrl: "https://plafondhogedeur.nl/collections/deurmodellen",
      showSecondaryButton: false,
    },
    2: {
      title: "Helaas is onze plafondhoge deur niet mogelijk!",
      content:
        "Alleen als u het houten kozijn verwijderd kunnen wij hier onze plafondhogedeur met kozijn in plaatsen. Er zijn echter wel alternatieven voor in het bestaande kozijn. Neem hiervoor contact op.",
      primaryButton: "Toch verder gaan",
      secondaryButton: "Contact voor alternatief",
      primaryUrl: "https://plafondhogedeur.nl/collections/deurmodellen",
      secondaryUrl: "https://plafondhogedeur.nl/pages/contact",
      showSecondaryButton: true,
    },
    3: {
      title: "Onze plafondhoge deur is mogelijk",
      content:
        "Bij een lege sparing is onze plafondhoge deur met kozijn vaak wel mogelijk mits dit niet hoger dan 270 cm is of breder dan 105 cm",
      primaryButton: "Verder gaan",
      secondaryButton: "Meer informatie",
      primaryUrl: "https://plafondhogedeur.nl/collections/deurmodellen",
      secondaryUrl: "https://plafondhogedeur.nl/collections/deurmodellen",
    },
  };

  return (
    <div className="container">
      <div className="logo">
        <img
          src="https://plafondhogedeur.nl/cdn/shop/t/2/assets/phd-logo.svg?v=173245948125749905881618906759"
          alt="Logo"
        />
      </div>
      <h1>Selecteer de situatie bij u thuis. Klik op de foto</h1>
      <div className="grid">
        <div className="card" onClick={() => setSelectedModal(1)}>
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
        <div className="card" onClick={() => setSelectedModal(2)}>
          <img
            src="https://cdn.shopify.com/s/files/1/0524/8794/6424/files/Houten-Kozijn-4.jpg?v=1732630584"
            alt="Houten kozijn"
          />
          <h2>Houten kozijn</h2>
        </div>
        <div className="card" onClick={() => setSelectedModal(3)}>
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
                onClick={() =>
                  handleButtonClick(modalContent[selectedModal].primaryUrl)
                }
              >
                {modalContent[selectedModal].primaryButton}
              </button>
              {modalContent[selectedModal].showSecondaryButton && (
                <button
                  className="modal-button secondary"
                  onClick={() =>
                    handleButtonClick(modalContent[selectedModal].secondaryUrl)
                  }
                >
                  {modalContent[selectedModal].secondaryButton}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
