import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const streets = [
    {
        name: "Vårbergsvägen",
        coords: [
            [59.27816650034319, 17.886587387106147],
            [59.278344288887205, 17.884797611879378],
            [59.2775823314481, 17.878955984403113],
            [59.27481374252619, 17.87917970633164],
            [59.27326425049414, 17.881044055848303],
           [59.27313723982537, 17.88144178367648],
           [59.27204492852011, 17.889495772196945],
           [59.27203222701982, 17.889769210078814],
           [59.27210843596083, 17.89044037619316],
            [59.27353097136485, 17.894989388127126],
            [59.27397550150584, 17.9108487856148],
          
        ],
        marker: [59.27356, 17.89989], // Markörposition för Vårbergsvägen
    },
    {
      name: "Ekholmsvägen",
      coords: [
        [59.27839992927531, 17.903456175944722],
        [59.27851152133369, 17.907264576665806],
        [59.27886085063027, 17.90766346152936],
        [59.28051526433697, 17.907634969742766],
        [59.2808160581873, 17.907131615033993],
        [59.28094704822696, 17.90648580144538],
        [59.28088883049377, 17.905887474150045],
        [59.279117993536, 17.90177516116209],
        [59.27877351863652, 17.901461751544907],
        [59.2782883368456, 17.901461751544907],
        [59.27699286756427, 17.90240198009767],
        [59.273979619180594, 17.903940536063256],
      ],
      marker: [59.280877054639646, 17.90693288997473],
    },
    {
      name: "Vårholmsbackarna",
      coords: [
       [59.2724516032066, 17.886878230295476],
        [59.273710894852556, 17.88664955388479],
        [59.27759233591566, 17.8864208774741],
        [59.278150500126536, 17.886776596336528],
        [59.279059119896836, 17.887640484999128],
        [59.27999367493582, 17.88837733121135],
        [59.280370085690826, 17.8892920368541],
        [59.2806296768903, 17.89084195474877],
        [59.28110991543388, 17.891959928409698],
        [59.2809801219124, 17.89417046704635],
        [59.281343542525605, 17.896126920782244],
        [59.2812007706045, 17.89912512261127],
        [59.27935766114293, 17.90189464802961],
      ],
      marker: [59.27428210458612, 17.88654792014263],
    },
    {
      name: "Äspholmsvägen",
      coords: [
        [59.27744943565588, 17.90257247005678],
        [59.27734816863316, 17.90488249492491],
        [59.27736764308401, 17.90611755772569],
        [59.277519543418286, 17.90780242734898],
        [59.277885659386705, 17.91018106692975],

      ],
      marker: [59.27740269706745, 17.90340346910175],
    },
      {
        name: "Brantholmsgränd",
        coords: [
          [59.27696257220023, 17.902237020672107],
            [59.27686519867622, 17.896305669607234],
        ],
        marker: [59.27692362282406, 17.899149363670155],

      },
      {
        name: "Falkholmsgränd",
        coords: [
         [59.28027314096319, 17.90043425901211],
            [59.280043839559, 17.899931951336008],
            [59.27990734989474, 17.898916648586443],
            [59.27977631930228, 17.898125781181523],
            [59.279339547018694, 17.896768481716318],
            [59.27921943365842, 17.896212737053403],
        ],
        marker: [59.2798691326907, 17.89882046201017],

      },
      {
        name: "Högholmsgränd",
        coords: [
          [59.280469683831235, 17.898232655010954],
            [59.28122308750811, 17.89824334240832],
        ],
        marker: [59.28080271215021, 17.898232655010954],

      },
      {
        name: "Varpholmsgränd",
        coords: [
            [59.280150412359944, 17.89499724244231],
            [59.281080725286536, 17.89505888189283],
        ],
        marker: [59.28053519785628, 17.895026435801814],

      },
      {
        name: "Bullerholmsgränd",
        coords: [
            [59.280950117063746, 17.893316451912423],
            [59.28018578824221, 17.89322026533615],
            [59.28018032868891, 17.891916402857763],
            [59.28024038372709, 17.89142478257903],
            [59.28031135772656, 17.891029348876568],
            [59.28016940957968, 17.890281231061103],
            [59.280060218294764, 17.889607925027182],
            [59.27960707072012, 17.889565175437728],
        ],
        marker: [59.28019124779464, 17.891905715460403],

      },
      {
        name: "Norrholmsgränd",
        coords: [
           [59.2812647599604, 17.890499166346107],
            [59.28123850808541, 17.88950070863982],
            [59.281084746696855, 17.889309827019503],
            [59.280488445962895, 17.889317168620284],
        ],
        marker: [59.28124975889144, 17.889853105477332],

      },
      {
        name: "Stångholmsbacken",
        coords: [
            [59.278519454226206, 17.8950803252467],
            [59.27841818871758, 17.887327594821432],
        ],
        marker: [59.278519454226206, 17.893406440268517],

      },
      {
        name: "Dyvholmsgränd",
        coords: [
            [59.2804263742159, 17.887102413759248],
            [59.28043182575533, 17.883506021600287],
        ],
        marker: [59.28056811395692, 17.886568824418156],

      },
      {
        name: "Våruddsringen",
        coords: [
           [59.278212778367106, 17.883359658316873],
            [59.27886774749912, 17.88294544823761],
            [59.28066129078434, 17.88326103686943],
            [59.28101394267466, 17.883182139711472],
            [59.28153787588094, 17.88262985960579],
            [59.28183006589762, 17.881525299394415],
            [59.281981197680835, 17.880203771998673],
        ],
        marker: [59.281940603683346, 17.87999627458118],

      },
      {
        name: "Rönnholmsgränd",
        coords: [
           [59.27694621140957, 17.88245955678088],
            [59.27684495641144, 17.879171346610512],
        ],
        marker: [59.276932403927546, 17.882351451241036],

      },
      {
        name: "Ängsholmsgränd",
        coords: [
           [59.27557664885905, 17.883897736349258],
            [59.27553506026849, 17.879291793358572],
        ],
        marker: [59.27558704599875, 17.8825071350045],

      },
      {
        name: "Båtholmsbacken",
        coords: [
           [59.27405516650932, 17.882391816870246],
            [59.27306391366084, 17.88239860029144],
        ],
        marker: [59.273913065599864, 17.882439300818607],

      },
      {
        name: "Gränsholmsbacken",
        coords: [
           [59.27378829357135, 17.88470496360337],
            [59.272758906970374, 17.8846710464974],
        ],
        marker: [59.27365312336806, 17.88469818018217],

      },
      {
        name: "Storholmsbackarna",
        coords: [
           [59.274927929923194, 17.892343060483213],
            [59.27502083270349, 17.89229289914519],
            [59.27540205180333, 17.89334001707644],
            [59.27537322025588, 17.8936786061081],
            [59.27530915006305, 17.89386044095844],
            [59.275097717571384, 17.894173949321086],
            [59.27486065533783, 17.894286812331643],
            [59.27462679503098, 17.894293082498894],
            [59.27452107683094, 17.89424292116087],
            [59.27423595641282, 17.894073626645042],
            [59.27324922911335, 17.892455923511825],
            [59.27265653824407, 17.8910263253611],
            [59.27257644409503, 17.89060622415515],
            [59.272480330867566, 17.890010558266113],
            [59.27258925917155, 17.88949013438411],
            [59.27278148474041, 17.88918916635597],
        ],
        marker: [59.275392441290236, 17.8935720132648],

      },
      {
        name: "Idholmsvägen",
        coords: [
           [59.276292186449, 17.89774107678467],
            [59.273756540828664, 17.897718046975886],
        ],
        marker: [59.27586272843012, 17.897764106593453],

      },
    
  ];

export default function BrandMap() {
  const [selectedStreet, setSelectedStreet] = useState(null);
  const [showCorrectStreet, setShowCorrectStreet] = useState(false);
  const [question, setQuestion] = useState(null);
  const [askedStreets, setAskedStreets] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(50);
  const [milliseconds, setMilliseconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [markerColors, setMarkerColors] = useState({});
  const [score, setScore] = useState(0); // För att hålla koll på poäng
  const timerRef = useRef(null);
  const [lastGuessedStreet, setLastGuessedStreet] = useState(null)
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [openPopups, setOpenPopups] = useState({});

  // Funktion för att stänga alla popups
  const CloseAllPopups = () => {
    const popupWrappers = document.querySelectorAll('.leaflet-popup-content-wrapper');
    popupWrappers.forEach((popupWrapper) => {
      popupWrapper.style.display = 'none';
    });
  };

  // Starta om timern när en ny fråga ställs
  const startTimer = () => {
    setTimer(50);
    setMilliseconds(0);
    setTimerRunning(true);
  };

  // Stoppa timern när användaren gissar rätt
  const stopTimer = () => {
    setTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Hantera timer
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 0) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            setQuestion(""); // Clear the current question text
  
            // Automatically proceed to the next question when the timer ends
            const correctStreet = question.replace("").trim();
            const newAskedStreets = [...askedStreets, correctStreet];
            setAskedStreets(newAskedStreets);
  
            if (newAskedStreets.length === streets.length) {
              setGameOver(true); // When all streets have been guessed
            } else {
              CloseAllPopups();
              const remainingStreets = streets.filter(
                (street) => !newAskedStreets.includes(street.name)
              );
              const randomStreet = remainingStreets[Math.floor(Math.random() * remainingStreets.length)];
              setQuestion(`${randomStreet.name}`);
              startTimer(); // Restart timer for the new question
            }
  
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
  
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerRunning, askedStreets, question]);

  useEffect(() => {
    if (question) {
      CloseAllPopups();
      setMarkerColors((prevColors) => {
        const newColors = {};
        Object.keys(prevColors).forEach((streetName) => {
          if (prevColors[streetName] === "green") {
            newColors[streetName] = "green"; // Behåll gröna markörer
          } else {
            newColors[streetName] = "grey"; // Återställ andra till grå
          }
        });
        return newColors;
      });
      setSelectedStreet(null);
      setLastGuessedStreet(null);
    }
  }, [question]);

  const handleGuess = (street) => {
    const correctStreet = question?.trim() || "";

    console.log("Fråga:", correctStreet);
    console.log("Vald gata:", street.name);
  
    // Pausa timern när användaren gissar
    stopTimer();
  
    if (street.name === correctStreet) {
      setSelectedStreet(street);
      setShowCorrectStreet(true);
      setLastGuessedStreet(null);
      setWrongGuesses(0);
      setMarkerColors((prevColors) => ({
        ...prevColors,
        [street.name]: "green", // Grön färg för rätt svar
      }));
  
      // Poängberäkning: Lägg till poäng för varje rätt svar
      const pointsForAnswer = Math.floor(100 / streets.length); // Exempel: 100% / antal frågor
      setScore((prevScore) => prevScore + pointsForAnswer);
  
      setTimeout(() => {
        setShowCorrectStreet(false);
  
        const correctStreet = question.replace("").trim();
        const newAskedStreets = [...askedStreets, correctStreet];
        setAskedStreets(newAskedStreets);
  
        if (newAskedStreets.length === streets.length) {
          setGameOver(true); // När alla gator är besvarade
        } else {
          CloseAllPopups();
  
          const remainingStreets = streets.filter(street => !newAskedStreets.includes(street.name));
          const randomStreet = remainingStreets[Math.floor(Math.random() * remainingStreets.length)];
          setQuestion(`${randomStreet.name}`);
          startTimer(); // Starta om timern för nästa fråga
        }
      }, 5000);
    } else {
        setWrongGuesses((prevGuesses) => prevGuesses + 1);
        setLastGuessedStreet(street);
      setMarkerColors((prevColors) => ({
        ...prevColors,
        [street.name]: "red",
      }));
      if (wrongGuesses >= 2) {
        setWrongGuesses(0); // Återställ felaktiga gissningar
        setTimeout(() => {
          const correctStreet = question.replace("").trim();
          const newAskedStreets = [...askedStreets, correctStreet];
          setAskedStreets(newAskedStreets);

          if (newAskedStreets.length === streets.length) {
            setGameOver(true); // När alla gator är besvarade
          } else {
            CloseAllPopups();
            const remainingStreets = streets.filter(street => !newAskedStreets.includes(street.name));
            const randomStreet = remainingStreets[Math.floor(Math.random() * remainingStreets.length)];
            setQuestion(`${randomStreet.name}`);
            startTimer(); // Starta om timern för nästa fråga
          }
        }, 5000);
      } else {
        setTimeout(() => {
          setLastGuessedStreet(null);
          
          setMarkerColors((prevColors) => { // Lägg till prevColors som en parameter här
            if (prevColors[street.name] === "red") {
              return {
                ...prevColors,
                [street.name]: "grey",
              };
            }
            return prevColors; // Returnera oförändrat prevColors om färgen inte är röd
          });
            
          startTimer(); // Starta om timern för nästa gissning
        }, 2000);
      }
    }
  };
  
  // Starta spelet
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setAskedStreets([]);
    setTimer(30);
    setMilliseconds(0);
    setQuestion("");
    setScore(0);  // Nollställ poäng vid start
    startTimer();

    const randomStreet = streets[Math.floor(Math.random() * streets.length)];
    setQuestion(`${randomStreet.name}`);
  };

  // Starta om spelet
  const restartGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setAskedStreets([]);
    setTimer(30);
    setMilliseconds(0);
    setMarkerColors({});
    setQuestion("");
    setScore(0);
    startTimer();

    const randomStreet = streets[Math.floor(Math.random() * streets.length)];
    setQuestion(`Klicka på ${randomStreet.name}`);
  };

  return (
    <div className="container">
      {!gameStarted ? (
        <div>
            <h2>Välkommen till Vägmästarna</h2>
          <button onClick={startGame}>Start</button>
        </div>
      ) : gameOver ? (
        <div>
          <h2>Spelet är slut! Alla gator har blivit frågade.</h2>
          <h2>Din poäng: {score}%</h2> {/* Visa poäng */}
          <button onClick={restartGame}>Starta om spelet</button>
        </div>
      ) : (
        <div>
          <h2
          >
            {question}  
          </h2>
            <h2   style={{
              color: timer < 15 ? "red" : timer < 30 ? "yellow" : "white",
            }}>
            {timer} sekunder - Kvar
            </h2>
          <h2>Poäng: {score}%</h2> {/* Visa poäng i realtid */}
        </div>
      )}
      <MapContainer
        center={[59.27761680466549, 17.894674673677482]}
        zoom={15}
        style={{ height: "80vh", width: "100vw",
         }}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png" />

        {streets.map((street, index) => (
          <Marker
            key={index}
            position={street.marker}
            icon={L.divIcon({
              className: "leaflet-div-icon",
              html: `<div style="background-color: ${markerColors[street.name] || "grey"}; width: 25px; height: 25px; border-radius: 50%;"></div>`,
              iconSize: [30, 30],
              iconAnchor: [15, 30],
            })}
            eventHandlers={{
              click: () => handleGuess(street),
            }}
          >
            <Popup>{street.name}</Popup>
          </Marker>
        ))}

{streets.map((street, index) => (
  selectedStreet?.name === street.name && (
    <Polyline
      key={index}
      positions={street.coords}
      color="blue"
      weight={5}
    />
  )
))}

{lastGuessedStreet && lastGuessedStreet.name !== selectedStreet?.name && (
  <Polyline 
    positions={lastGuessedStreet.coords} 
    color="red" 
    weight={5} 
  />
)}
      </MapContainer>
    </div>
  );
}
