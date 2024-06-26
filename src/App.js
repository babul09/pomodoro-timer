import './App.css';
import Header from './components/Header/header'
import Controls from './components/Controls/controls'
import TimerDisplay from './components/TimerDisplay/timerdisplay'
import Button from './components/Button/button'
import Settings from './components/Settings/settings'
/*import TextComponent from './components/TextComponent';*/
import { useState, useEffect } from 'react';
import useSound from 'use-sound'
import timesUpSfx from './sounds/timup.wav'
import HistoryBox from './components/HistoryBox';



function App() {
  const [ settingsVisible, setSettingsVisible ] = useState(true)
  const [ timerMode, setTimerMode ] = useState('pomo')   // options: pomo, short, long
  const [ pomoLength, setPomoLength ] = useState(25)
  const [ shortLength, setShortLength ] = useState(3)
  const [ longLength, setLongLength ] = useState(15)
  const [ fontPref, setFontPref ] = useState('kumbh')         // options: kumbh, roboto, space
  const [ accentColor, setAccentColor ] = useState('default') 
  const [ secondsLeft, setSecondsLeft] = useState(pomoLength * 60)
  const [ isActive, setIsActive ] = useState(false)
  const [ buttonText, setButtonText ] = useState('START')
  const [startTime, setStartTime] = useState(null);
  
  const modeLabels = {
    'pomo': 'Pomodoro',
    'short': 'Short Break',
    'long': 'Long Break'
  };

  useEffect(() => {
    if (isActive) {
      handleTimerStart();
    }
  }, [isActive]);

  const handleTimerStart = () => {
    const currentTime = new Date();
    const options = { hour: '2-digit', minute: '2-digit', second:'2-digit', hour12: true };
    const timeString = currentTime.toLocaleTimeString('en-US', options);
    
    setStartTime(timeString);
  };

  const handleTimerEnd = () => {
    const currentTime = new Date();
    const options = { hour: '2-digit', minute: '2-digit', second:'2-digit', hour12: true };
    const timeString = currentTime.toLocaleTimeString('en-US', options);
  
    setHistory(prevHistory => {
      const newHistory = [
        ...prevHistory, 
        `Timer started at ${startTime}, ended at ${timeString}. Mode:  ${modeLabels[timerMode]}`
      ];
      localStorage.setItem('timerHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('timerHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
    
  });

  const clearHistory = () => {
    setHistory([]); // This will clear the history
  };

  const [ volume, setVolume ] = useState(1)
  const [ timesUp ] = useSound(timesUpSfx, {
                                volume: volume,
                              })

  useEffect(() => {
    if(isActive) {
      const interval = setInterval(() => {
        setSecondsLeft(secondsLeft => secondsLeft - 1)
      }, 1000)
    
      if(secondsLeft === 0) {
        clearInterval(interval)
        setIsActive(false)
        setButtonText('')
        timesUp()
        handleTimerEnd();
      }

      return () => clearInterval(interval)
    }
    
  }, [isActive, secondsLeft, timesUp]);


  const toggleSettingsVisibility = (event) => {
    setSettingsVisible(!settingsVisible)
  }

  const formatTimeLeft = (seconds) => {
    return(`${Math.floor(seconds / 60)}:${
            (seconds % 60 > 9)
              ? seconds % 60
              : '0' + seconds % 60
          }`)
  }

  const calcPercentage = () => {
    if(timerMode === 'pomo') {
      return((secondsLeft / (pomoLength * 60)) * 100)
    }
    if(timerMode === 'short') {
      return((secondsLeft / (shortLength * 60)) * 100)
    }
    if(timerMode === 'long') {
      return((secondsLeft / (longLength * 60)) * 100)
    }
    
  }

  return (
    <div className="pomodoro-app">
      <Header title="Pomodoro Timer" />
      <h3 className="subheader">by Babul</h3>
      <Controls
        timerMode={timerMode}
        setTimerMode={setTimerMode}
        setSecondsLeft={setSecondsLeft}
        pomoLength={pomoLength}
        shortLength={shortLength}
        longLength={longLength}
        setIsActive={setIsActive}
        buttonText={buttonText}
        setButtonText={setButtonText}
        volume={volume}
        />
      <TimerDisplay
        timerMode={timerMode}
        percentage={calcPercentage()}
        timeLeft={formatTimeLeft(secondsLeft)}
        isActive={isActive}
        setIsActive={setIsActive}
        buttonText={buttonText}
        setButtonText={setButtonText}
        volume={volume}
        setVolume={setVolume}
        onEnd={handleTimerEnd}
        />
         <HistoryBox history={history} setHistory={setHistory} />
      <Button type="settings" toggleVisibility={toggleSettingsVisibility} />
      <Settings visible={settingsVisible}
                toggleSettingsVisibility={toggleSettingsVisibility} 
                pomoLength={pomoLength}
                setPomoLength={setPomoLength}
                shortLength={shortLength}
                setShortLength={setShortLength}
                longLength={longLength}
                setLongLength={setLongLength}
                fontPref={fontPref}
                setFontPref={setFontPref}
                accentColor={accentColor}
                setAccentColor={setAccentColor}
                closeSettings={toggleSettingsVisibility}
                setSecondsLeft={setSecondsLeft}
                timerMode={timerMode}
                />
    </div>
  );
}

export default App;